// src/middleware/requireRole.js
import User from "../models/user.js";

export default function requireRole(requiredRole) {
  return (req, res, next) => {
    try {
      // req.user must be set by your auth middleware (decoded token)
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }

      next();
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  };
}
