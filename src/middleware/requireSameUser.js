export default function requireSameUser(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
  
      if (req.user.id !== req.params.userId) {
        return res.status(403).json({ message: "Forbidden: not your account" });
      }
  
      next();
  
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  }
  