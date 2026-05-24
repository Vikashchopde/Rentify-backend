import User from "../models/user.js";

export const userProfile = async (req, res) => {
    try {
      if (!req.params.userId) {
          return res.status(400).json({ message: "User ID required" });
        }
        
      const user = await User.findById(req.params.userId).select("-password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(user);
  
    } catch (err) {
      res.status(500).json({ message: " user profile Server error" });
    }
  };

  export const updateUserProfile = async (req, res) => {
    try {
      const { name, phone, profileImage } = req.body;
  
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { name, phone, profileImage },
        { new: true }
      ).select("-password");
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json({
        message: "Profile updated successfully",
        user
      });
  
    } catch (err) {
      res.status(500).json({ message: " user profile Server error" });
    }
  };