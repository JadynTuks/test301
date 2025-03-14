// src/routes/documentRoutes.js
import express from "express";
import { 
  createDocument, 
  readDocument, 
  readDocuments, 
  updateDocument, 
  deleteDocument,
  queryDocuments
} from "../controllers/documentController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new document
router.post("/create", authenticateUser, createDocument);

// Read a single document
router.get("/read", authenticateUser, readDocument);

// Read all documents in a collection
router.get("/list", authenticateUser, readDocuments);

// Update a document
router.put("/update", authenticateUser, updateDocument);

// Delete a document
router.delete("/delete", authenticateUser, deleteDocument);

// Query documents
router.post("/query", authenticateUser, queryDocuments);

export default router;