import Listing from "../models/listing.js";
import User from "../models/user.js";

export const owner = async (req, res) => {
    try {
      const ownerId = req.params.ownerId;
  
      // Get owner info
      const owner = await User.findById(ownerId).select("-password");
      if (!owner) {
        return res.status(404).json({ message: "Owner not found" });
      }
  
      // Get listings created by this owner
      const listings = await Listing.find({ owner: ownerId });
  
      res.json({ owner, listings });
  
    } catch (error) {
      res.status(500).json({ message: " geting owner Server error" });
    }
  };

  export const updateOwnerProfile = async (req, res) => {
    if (req.user.id !== req.params.ownerId)
      return res.status(403).json({ message: "Not allowed" });
  
    const user = await User.findByIdAndUpdate(
      req.params.ownerId,
      req.body,
      { new: true }
    ).select("-password");
  
    res.json({ user });
  };