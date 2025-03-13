
import serverConfig from "../config/env.js";
import { v4 as uuidv4 } from "uuid";
import { execSync } from "child_process";
import os from "os";
import net from "net";

// Debug mode
const DEBUG = true;
function log(...args) {
  if (DEBUG) console.log('[TCP Client]', ...args);
}

let client = new net.Socket();
let isConnected = false;
let reconnectTimer = null;
let isWSL = false;
let pendingRequests = new Map();

// Enhanced WSL detection with multiple methods
try {
  // Method 1: Check OS release
  const osRelease = os.release().toLowerCase();
  isWSL = osRelease.includes("microsoft") || osRelease.includes("wsl");
  
  // Method 2: Check /proc/version for WSL
  try {
    const procVersion = execSync("cat /proc/version").toString().toLowerCase();
    if (procVersion.includes("microsoft") || procVersion.includes("wsl")) {
      isWSL = true;
    }
  } catch (err) {
    // Ignore errors for this check
  }
  
  if (isWSL) {
    log("🔍 Detected WSL environment");
  }
} catch (err) {
  console.error("Could not detect environment:", err);
}

// Get Windows host IP with multiple fallbacks for WSL
const getWindowsHostIP = () => {
  // First check environment config
  if (serverConfig.daemonHost && 
      serverConfig.daemonHost !== "127.0.0.1" && 
      serverConfig.daemonHost !== "localhost") {
    log(`Using configured daemon host: ${serverConfig.daemonHost}`);
    return serverConfig.daemonHost;
  }
  
  // For WSL, we need special handling
  if (isWSL) {
    log("Resolving Windows host from WSL...");
    
    try {
      // Try multiple methods to find the Windows host IP
      
      // Method 1: Use route command to find default gateway
      try {
        const routeOutput = execSync("ip route | grep default").toString();
        const defaultGateway = routeOutput.split(" ")[2];
        if (defaultGateway) {
          log(`🔍 Found Windows host at ${defaultGateway} via default gateway`);
          return defaultGateway;
        }
      } catch (err) {
        log("Could not determine Windows host via default gateway");
      }
      
      // Method 2: Use hostname resolution (works in recent WSL)
      try {
        const hostnameOutput = execSync("cat /etc/resolv.conf | grep nameserver").toString();
        const nameserver = hostnameOutput.split(" ")[1]?.trim();
        if (nameserver && nameserver !== "127.0.0.1") {
          log(`🔍 Found Windows host at ${nameserver} via nameserver`);
          return nameserver;
        }
      } catch (err) {
        log("Could not determine Windows host via nameserver");
      }
      
      // Method 3: Try directly resolving host.wsl.internal
      try {
        const wslHostOutput = execSync("ping -c 1 host.wsl.internal").toString();
        const match = wslHostOutput.match(/\(([^)]+)\)/);
        if (match && match[1]) {
          log(`🔍 Found Windows host at ${match[1]} via host.wsl.internal`);
          return match[1];
        }
      } catch (err) {
        log("Could not resolve host.wsl.internal");
      }
      
      // Fallback to common WSL-to-Windows IPs
      const wslHostIPs = [
        "172.17.0.1",     // Common default gateway in WSL2
        "172.18.0.1",     // Alternative WSL2 gateway
        "172.19.0.1",     // Alternative WSL2 gateway
        "172.20.0.1",     // Alternative WSL2 gateway
        "172.21.0.1",     // Alternative WSL2 gateway
        "172.22.0.1",     // Alternative WSL2 gateway
        "172.23.0.1",     // Alternative WSL2 gateway
        "172.24.0.1",     // Alternative WSL2 gateway
        "172.25.0.1",     // Alternative WSL2 gateway
        "172.26.0.1",     // Alternative WSL2 gateway
        "172.27.0.1",     // Alternative WSL2 gateway
        "172.28.0.1",     // Alternative WSL2 gateway
        "172.29.0.1",     // Alternative WSL2 gateway
        "172.30.0.1",     // Alternative WSL2 gateway
        "172.31.0.1",     // Alternative WSL2 gateway
        "192.168.1.1",    // Common router address that might work
        "host.docker.internal", // Docker for Windows hostname
        "localhost",
        "127.0.0.1"
      ];
      
      log(`🔍 Will try common WSL-to-Windows host addresses: ${wslHostIPs.join(", ")}`);
      return wslHostIPs;
    } catch (err) {
      log(`Error resolving Windows host: ${err.message}`);
      // Return both localhost and common WSL-to-Windows IPs
      return ["localhost", "127.0.0.1", "172.17.0.1"];
    }
  }
  
  // Default for non-WSL environments
  return ["127.0.0.1", "localhost"];
};

// Enhanced connection with better retry logic
const connectToDaemon = async (retries = 5, delay = 2000) => {
  return new Promise(async (resolve, reject) => {
    if (isConnected && client.writable) {
      log("✅ Already connected to daemon");
      return resolve();
    }
    
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    
    if (!client.destroyed) {
      client.removeAllListeners();
      client.destroy();
    }
    
    const hosts = getWindowsHostIP();
    const hostsToTry = Array.isArray(hosts) ? hosts : [hosts];
    const port = serverConfig.daemonPort || 3000;
    
    log(`🔌 Will attempt connection to daemon using ${hostsToTry.length} possible host addresses on port ${port}`);
    
    // Try each host sequentially with improved retry logic
    const tryNextHost = async (hostIndex = 0, attemptPerHost = 0) => {
      if (hostIndex >= hostsToTry.length) {
        // We've tried all hosts at least once
        if (attemptPerHost < retries - 1) {
          log(`No hosts responded. Starting next round of attempts (${attemptPerHost + 2}/${retries})...`);
          setTimeout(() => tryNextHost(0, attemptPerHost + 1), delay);
        } else {
          reject(new Error(`Failed to connect after trying all hosts (${hostsToTry.join(", ")})`));
        }
        return;
      }
      
      const currentHost = hostsToTry[hostIndex];
      log(`Trying host ${currentHost} (attempt ${attemptPerHost + 1}/${retries})...`);
      
      const newClient = new net.Socket();
      
      newClient.once("connect", () => {
        log(`🟢 Connected to daemon successfully at ${currentHost}:${port}`);
        client = newClient;
        isConnected = true;
        
        // Handle data with better message parsing
        client.on("data", handleData);
        
        client.on("close", () => {
          log("🔌 TCP connection closed");
          if (isConnected) {
            isConnected = false;
            
            // Reject all pending requests
            pendingRequests.forEach((info, requestId) => {
              info.reject(new Error("Connection closed"));
            });
            pendingRequests.clear();
            
            log("Scheduling reconnection attempt...");
            reconnectTimer = setTimeout(() => connectToDaemon().catch(console.error), 5000);
          }
        });
        
        client.on("error", (err) => {
          log(`TCP connection error: ${err.message}`);
        });
        
        resolve();
      });
      
      newClient.once("error", (err) => {
        log(`❌ Connection error to ${currentHost}:${port} - ${err.message}`);
        newClient.destroy();
        
        // Try next host with a short delay
        setTimeout(() => tryNextHost(hostIndex + 1, attemptPerHost), 500);
      });
      
      newClient.once("close", () => {
        if (client === newClient) {
          isConnected = false;
        }
      });
      
      // Set a longer timeout and add keepalive settings
      newClient.setTimeout(0); // 0 disables the timeout
      newClient.setKeepAlive(true, 15000);
      
      newClient.once("timeout", () => {
        log(`❌ Connection to ${currentHost}:${port} timed out`);
        newClient.destroy();
        
        // Try next host
        setTimeout(() => tryNextHost(hostIndex + 1, attemptPerHost), 500);
      });
      
      // Try to connect
      log(`Attempting to connect to daemon at ${currentHost}:${port}...`);
      newClient.connect(port, currentHost);
    };
    
    // Start the host connection attempt sequence
    tryNextHost();
  });
};

// Enhanced data handler with better message parsing
const handleData = (data) => {
  try {
    const responseStr = data.toString();
    log("📥 Raw data received from daemon:", responseStr);
    
    // Parse each response separately (might contain multiple responses)
    const responses = responseStr.split('\n')
      .filter(line => line.trim())
      .map(response => {
        try {
          return JSON.parse(response);
        } catch (err) {
          log(`Error parsing response part: ${err.message}`);
          return null;
        }
      })
      .filter(response => response !== null);
    
    // Handle each valid response
    for (const response of responses) {
      if (response.requestId && pendingRequests.has(response.requestId)) {
        const { resolve } = pendingRequests.get(response.requestId);
        pendingRequests.delete(response.requestId);
        resolve(response);
      }
    }
  } catch (err) {
    log(`❌ Error handling data: ${err.message}`);
  }
};

// Enhanced send function with better error handling and retry
export const sendToDaemon = (message) => {
  return new Promise(async (resolve, reject) => {
    if (!message.action && !message.operation) {
      return reject(new Error("Message must include an action or operation field"));
    }

    // Try to connect with retry
    let connectionAttempts = 0;
    const maxConnectionAttempts = 3;
    
    const attemptSend = async () => {
      try {
        await connectToDaemon();
        
        // Convert action to operation if needed for the Java daemon
        if (message.action && !message.operation) {
          message.operation = message.action;
        }

        const requestId = uuidv4();
        const jsonMessage = JSON.stringify({ ...message, requestId }) + "\n";
        log("📤 Sending to daemon:", jsonMessage);

        // Store the promise handlers for this request
        const requestPromise = new Promise((resolveRequest, rejectRequest) => {
          pendingRequests.set(requestId, { 
            resolve: resolveRequest, 
            reject: rejectRequest, 
            timestamp: Date.now(),
            message
          });
        });

        // Send the message
        client.write(jsonMessage, (err) => {
          if (err) {
            pendingRequests.delete(requestId);
            reject(err);
          }
        });

        // Wait for the response
        try {
          const response = await requestPromise;
          resolve(response);
        } catch (error) {
          reject(error);
        }
      } catch (err) {
        connectionAttempts++;
        if (connectionAttempts < maxConnectionAttempts) {
          log(`Connection attempt ${connectionAttempts} failed, retrying...`);
          await new Promise(r => setTimeout(r, 2000)); // Wait 2 seconds before retry
          return attemptSend();
        }
        reject(err);
      }
    };
    
    attemptSend();
  });
};

// Clean up stale requests periodically
setInterval(() => {
  const now = Date.now();
  pendingRequests.forEach((info, requestId) => {
    if (now - info.timestamp > 3600000) {  // 1 hour instead of 2 minutes
      log(`Cleaning up stale request ${requestId}`);
      info.reject(new Error("Request timed out after 1 hour"));
      pendingRequests.delete(requestId);
    }
  });
}, 600000); // Check every 10 minutes instead of every 30 seconds

// Add a method to check daemon status
export const checkDaemonConnection = async () => {
  try {
    const response = await sendToDaemon({ action: "LIST_DB" });
    return {
      connected: true,
      response
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
};

// Export for use in other files
export default {
  sendToDaemon,
  checkDaemonConnection
};

