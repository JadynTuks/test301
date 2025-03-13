import express from "express";
import cors from "cors";

import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import dbRoutes from "./routes/dbRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

import healthRoutes from './routes/healthRoutes.js';

import { errorHandler } from "./utils/errorHandler.js";

const app = express();

// Middleware
app.use(cors());

app.use(helmet());

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/db", dbRoutes);
app.use("/collection", collectionRoutes);
app.use("/document", documentRoutes);

app.use('/health', healthRoutes);


// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

export default app;
