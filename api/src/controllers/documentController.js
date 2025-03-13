// src/controllers/documentController.js
import { sendToDaemon } from "../services/tcpClient.js";

// Create a document
export const createDocument = async (req, res) => {
  try {
    const { dbName, collectionName, document, documentId } = req.body;

    if (!dbName || !collectionName || !document) {
      return res.status(400).json({ error: "dbName, collectionName, and document are required." });
    }

    console.log(`📩 Received request to insert document into collection: ${collectionName} in DB: ${dbName}`);

    const request = {
      action: "CREATE_DOCUMENT",
      dbName,
      collectionName,
      document
    };

    // Add documentId if provided
    if (documentId) {
      request.documentId = documentId;
    }

    const response = await sendToDaemon(request);

    console.log("✅ Daemon response:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ Error in createDocument:", error);
    res.status(500).json({ error: "Daemon error", details: error.message });
  }
};

// Read a single document
export const readDocument = async (req, res) => {
  try {
    const { dbName, collectionName, documentId } = req.query;

    if (!dbName || !collectionName || !documentId) {
      return res.status(400).json({ error: "dbName, collectionName, and documentId are required." });
    }

    console.log(`📩 Received request to read document: ${documentId} from collection: ${collectionName} in DB: ${dbName}`);

    const response = await sendToDaemon({
      action: "READ_DOCUMENT",
      dbName,
      collectionName,
      documentId
    });

    console.log("✅ Daemon response:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ Error in readDocument:", error);
    res.status(500).json({ error: "Daemon error", details: error.message });
  }
};

// Read all documents in a collection
export const readDocuments = async (req, res) => {
  try {
    const { dbName, collectionName } = req.query;

    if (!dbName || !collectionName) {
      return res.status(400).json({ error: "dbName and collectionName are required." });
    }

    console.log(`📩 Received request to read all documents from collection: ${collectionName} in DB: ${dbName}`);

    const response = await sendToDaemon({
      action: "READ_DOCUMENTS",
      dbName,
      collectionName
    });

    console.log("✅ Daemon response:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ Error in readDocuments:", error);
    res.status(500).json({ error: "Daemon error", details: error.message });
  }
};

// Update a document
export const updateDocument = async (req, res) => {
  try {
    const { dbName, collectionName, documentId, updates } = req.body;

    if (!dbName || !collectionName || !documentId || !updates) {
      return res.status(400).json({ error: "dbName, collectionName, documentId, and updates are required." });
    }

    console.log(`📩 Received request to update document: ${documentId} in collection: ${collectionName}, DB: ${dbName}`);

    const response = await sendToDaemon({
      action: "UPDATE_DOCUMENT",
      dbName,
      collectionName,
      documentId,
      updates
    });

    console.log("✅ Daemon response:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ Error in updateDocument:", error);
    res.status(500).json({ error: "Daemon error", details: error.message });
  }
};

// Delete a document
export const deleteDocument = async (req, res) => {
  try {
    const { dbName, collectionName, documentId } = req.body;

    if (!dbName || !collectionName || !documentId) {
      return res.status(400).json({ error: "dbName, collectionName, and documentId are required." });
    }

    console.log(`📩 Received request to delete document: ${documentId} from collection: ${collectionName}, DB: ${dbName}`);

    const response = await sendToDaemon({
      action: "DELETE_DOCUMENT",
      dbName,
      collectionName,
      documentId
    });

    console.log("✅ Daemon response:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ Error in deleteDocument:", error);
    res.status(500).json({ error: "Daemon error", details: error.message });
  }
};

// Query documents
export const queryDocuments = async (req, res) => {
  try {
    const { dbName, collectionName, query, sortBy, ascending, limit, skip } = req.body;

    if (!dbName || !collectionName || !query) {
      return res.status(400).json({ error: "dbName, collectionName, and query are required." });
    }

    console.log(`📩 Received query request for collection: ${collectionName} in DB: ${dbName}`);

    const request = {
      action: "QUERY",
      dbName,
      collectionName,
      query
    };

    // Add optional parameters if provided
    if (sortBy) request.sortBy = sortBy;
    if (ascending !== undefined) request.ascending = ascending;
    if (limit !== undefined) request.limit = limit;
    if (skip !== undefined) request.skip = skip;

    const response = await sendToDaemon(request);

    console.log("✅ Daemon response:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ Error in queryDocuments:", error);
    res.status(500).json({ error: "Daemon error", details: error.message });
  }
};