import express from "express";
import auth from "../middleware/auth.js";
import requireSameUser from "../middleware/requireSameUser.js";
import { wishlistUserId,wishlistRoom ,addWishlist,removeWishlist } from "../controllers/wishlistController.js";

const router = express.Router();

// ⭐ Get wishlist IDs for a user
router.get("/", auth, wishlistUserId);

//wishlist room detail 
router.post("/by-ids",wishlistRoom );

// ⭐ Add to wishlist
router.post("/add", auth, addWishlist);

// ⭐ Remove from wishlist
router.post("/remove", auth, removeWishlist);

export default router;
