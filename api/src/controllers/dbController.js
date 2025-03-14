import { sendToDaemon } from "../services/tcpClient.js";

export const createDatabase = async (req, res) => {
  try {
    console.log("📩 Received request to create DB:", req.body); // Log request body

    const { dbName } = req.body;
    if (!dbName) {
      console.log("❌ Missing dbName in request!");
      return res.status(400).json({ error: "dbName is required" });
    }

    console.log("📤 Sending request to daemon...");
    const response = await sendToDaemon({ action: "CREATE_DB", dbName });

    console.log("✅ Daemon response:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ Error in createDatabase:", error);
    res.status(500).json({ error: "Daemon error", details: error.message });
  }
};

export const listDatabases = async (req, res) => {
  try {
    const response = await sendToDaemon({ action: "LIST_DB" });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: true, message: "Daemon error", details: error.message });
  }
};

export const readDatabase = async (req, res) => {
  try {
    console.log("📩 Received request to read DB:", req.body); // Log request body

    const { dbName } = req.body;
    if (!dbName) {
      console.log("❌ Missing dbName in request!");
      return res.status(400).json({ error: "dbName is required" });
    }

    console.log("📤 Sending request to daemon...");
    const response = await sendToDaemon({ action: "READ_DB", dbName });

    console.log("✅ Daemon response:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ Error in readDatabase:", error);
    res.status(500).json({ error: "Daemon error", details: error.message });
  }
};

export const deleteDatabase = async (req, res) => {
  try {
    const { dbName } = req.body;
    if (!dbName) {
      console.log("❌ Missing dbName in request!");
      return res.status(400).json({ error: "dbName is required" });
    }

    console.log("📤 Sending request to daemon...");
    const response = await sendToDaemon({ action: "DELETE_DB", dbName });

    console.log("✅ Daemon response:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ Error in deleteDatabase:", error);
    res.status(500).json({ error: "Daemon error", details: error.message });
  }
};

export const readCollections = async (req, res) => {
  try {
    const { dbName } = req.query;
    if (!dbName) {
      return res.status(400).json({ error: "dbName is required" });
    }

    console.log(`📩 Received request to list collections for DB: ${dbName}`);

    const response = await sendToDaemon({
      action: "READ_COLLECTIONS",
      dbName
    });

    console.log("✅ Daemon response:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ Error in readCollections:", error);
    res.status(500).json({ error: "Daemon error", details: error.message });
  }
};


export const createDocument = async (req, res) => {
  try {
    const { dbName, collectionName, document } = req.body;

    if (!dbName || !collectionName || !document) {
      return res.status(400).json({ error: "dbName, collectionName, and document are required." });
    }

    console.log(`📩 Received request to insert document into collection: ${collectionName} in DB: ${dbName}`);

    const response = await sendToDaemon({
      action: "CREATE_DOCUMENT",
      dbName,
      collectionName,
      document
    });

    console.log("✅ Daemon response:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ Error in createDocument:", error);
    res.status(500).json({ error: "Daemon error", details: error.message });
  }
};