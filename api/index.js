// index.js
import app from "./src/app.js";
import serverConfig from "./src/config/env.js";
import { sendToDaemon } from "./src/services/tcpClient.js";

import os from "os";

const PORT = serverConfig.port || 5000;

// Display network interfaces to help with connectivity
const displayNetworkInfo = () => {
  try {
    const networkInterfaces = os.networkInterfaces();
    console.log('🌐 API available at:');
    console.log(`- http://localhost:${PORT}`);
    
    for (const iface of Object.values(networkInterfaces)) {
      for (const addr of iface) {
        if (addr.family === 'IPv4' && !addr.internal) {
          console.log(`- http://${addr.address}:${PORT}`);
        }
      }
    }
  } catch (err) {
    console.error(`Could not determine network interfaces: ${err.message}`);
  }
};

// Start the server directly - don't wait for daemon for initial startup
try {
  // Start the server first so clients can connect
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MPDB API Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    displayNetworkInfo();
  });

  // Set up error handling
  server.on('error', (error) => {
    console.error(`❌ Server error: ${error.message}`);
    process.exit(1);
  });

  // Now try to connect to daemon (don't block server startup)
  checkDaemonConnection().then(async (daemonAvailable) => {
    if (daemonAvailable) {
      try {
        // Create system database if it doesn't exist
        await sendToDaemon({ action: "CREATE_DB", dbName: "system" });
        
        // Create users collection if it doesn't exist
        await sendToDaemon({
          action: "CREATE_COLLECTION",
          dbName: "system",
          collectionName: "users"
        });
        
        console.log("✅ System database and users collection verified");
      } catch (error) {
        console.error(`❌ Error setting up system database: ${error.message}`);
      }
    } else {
      console.warn("⚠️ API running without daemon connection - limited functionality");
    }
  });
} catch (error) {
  console.error(`❌ Failed to start server: ${error.message}`);
  process.exit(1);
}

// Separate function to check daemon connection
async function checkDaemonConnection() {
  try {
    await sendToDaemon({ action: "LIST_DB" });
    console.log("✅ Successfully connected to MPDB daemon");
    return true;
  } catch (error) {
    console.error(`❌ Failed to connect to MPDB daemon: ${error.message}`);
    return false;
  }
}

