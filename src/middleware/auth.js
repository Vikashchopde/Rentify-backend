import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;  
    // decoded contains: { id: ..., role: ... }

    next();  // allow request to continue

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
