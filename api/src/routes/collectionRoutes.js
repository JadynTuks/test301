import express from "express";
import { createCollection, listCollections } from "../controllers/collectionController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route for creating a collection
router.post("/create", authenticateUser, createCollection);

// Route for listing collections (if needed)
router.get("/list", authenticateUser, listCollections);

export default router;
