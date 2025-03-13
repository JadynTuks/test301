import WebSocket from "ws";

const DAEMON_WS_URL = "ws://127.0.0.1:8081/ws"; // WebSocket server on daemon

const ws = new WebSocket(DAEMON_WS_URL);

ws.on("open", () => console.log("Connected to daemon via WebSocket"));
ws.on("close", () => console.log("WebSocket connection closed"));
ws.on("error", (error) => console.error("WebSocket error:", error));

export const sendWebSocketMessage = (message) => {
  return new Promise((resolve, reject) => {
    ws.send(JSON.stringify(message), (err) => {
      if (err) reject(err);
    });

    ws.on("message", (data) => {
      resolve(JSON.parse(data.toString()));
    });
  });
};
