import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  try {
    console.log("======== AUTH DEBUG ========");
    console.log("Cookies:", req.cookies);

    const token = req.cookies?.token;

    console.log("Token:", token);

    if (!token) {
      console.log("No token found");

      return res.status(401).json({
        message: "Not logged in",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded:", decoded);

    req.user = decoded;

    next();
  } catch (err) {
    console.log("AUTH ERROR:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}