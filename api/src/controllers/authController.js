
// src/controllers/authController.js

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendToDaemon } from "../services/tcpClient.js";
import serverConfig from "../config/env.js";

// User registration
export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: "Username, password, and email are required." });
    }

    console.log(`📩 Received registration request for user: ${username}`);

    // Check if user already exists
    const userCheckResponse = await sendToDaemon({
      action: "QUERY",
      dbName: "system",
      collectionName: "users",
      query: { username }
    });

    if (userCheckResponse.status === "success" && userCheckResponse.count > 0) {
      return res.status(400).json({ error: "Username already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user document
    const createUserResponse = await sendToDaemon({
      action: "CREATE_DOCUMENT",
      dbName: "system",
      collectionName: "users",
      document: {
        username,
        email,
        password: hashedPassword,
        created: new Date().toISOString(),
        role: "user"
      }
    });

    if (createUserResponse.status !== "success") {
      return res.status(500).json({ error: "Failed to create user", details: createUserResponse.message });
    }

    res.status(201).json({ 
      status: "success", 
      message: "User registered successfully" 
    });
  } catch (error) {
    console.error("❌ Error in register:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// User login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    console.log(`📩 Received login request for user: ${username}`);

    // Find user
    const userResponse = await sendToDaemon({
      action: "QUERY",
      dbName: "system",
      collectionName: "users",
      query: { username }
    });

    if (userResponse.status !== "success" || userResponse.count === 0) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Get user data
    const documentId = Object.keys(userResponse.documents)[0];
    const user = userResponse.documents[documentId];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: documentId, username: user.username, role: user.role },
      serverConfig.jwtSecret,
      { expiresIn: serverConfig.jwtExpiration }
    );

    res.json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("❌ Error in login:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }

};

// Example function that sends a message to the daemon
export const listDatabases = async (req, res) => {
  try {
    const message = {
      action: "LIST_DB"
    };

    const response = await sendToDaemon(message);
    res.json(response);
  } catch (error) {
    console.error("❌ Error in listDatabases:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }

};