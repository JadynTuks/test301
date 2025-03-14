import jwt from "jsonwebtoken";
import config from "../config/env.js";

export const authenticateUser = (req, res, next) => {


  
  console.log("🛑 Entered authenticateUser middleware");
  const token = req.header("Authorization") ? req.header("Authorization").split(" ")[1] : undefined;

  if (!token) {
    return res.status(401).json({ error: true, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: true, message: "Invalid token." });
  }
};


export const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin privileges required." });
  }
  
  next();
};
