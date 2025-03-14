import { sendToDaemon } from "../services/tcpClient.js";

// Create a Collection (CREATE_COLLECTION)
export const createCollection = async (req, res) => {
  try {
    const { dbName, collectionName } = req.body;

    if (!dbName || !collectionName) {
      console.log("❌ Missing dbName or collectionName in request!");
      return res.status(400).json({ error: "dbName and collectionName are required" });
    }

    console.log("📤 Sending request to daemon...");
    const response = await sendToDaemon({ action: "CREATE_COLLECTION", dbName, collectionName });

    console.log("✅ Daemon response:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ Error in createCollection:", error);
    res.status(500).json({ error: "Daemon error", details: error.message });
  }
};

// List Collections (LIST_COLLECTIONS) - Optional, based on your requirement
export const listCollections = async (req, res) => {
  try {
    const { dbName } = req.query;

    if (!dbName) {
      return res.status(400).json({ error: "dbName is required" });
    }

    console.log("📤 Sending request to daemon to list collections...");
    const response = await sendToDaemon({ action: "LIST_COLLECTIONS", dbName });

    console.log("✅ Daemon response:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ Error in listCollections:", error);
    res.status(500).json({ error: "Daemon error", details: error.message });
  }
};
