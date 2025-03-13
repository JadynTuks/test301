import express from "express";
import { createDatabase, listDatabases, readDatabase ,deleteDatabase ,readCollections
    ,createDocument 
  } from "../controllers/dbController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authenticateUser, createDatabase);
router.get("/list", authenticateUser, listDatabases);
router.post("/read", authenticateUser, readDatabase);
router.delete("/delete", authenticateUser, deleteDatabase);
router.get("/collections", authenticateUser, readCollections);
router.post("/document", authenticateUser, createDocument);

export default router;
