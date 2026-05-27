import express from "express";
import auth from "../middleware/auth.js";
import requireSameUser from "../middleware/requireSameUser.js";
import { addReview,updateReview,deleteReview } from "../controllers/reviewController.js";

const router = express.Router();

// ADD REVIEW
router.post("/:listingId",auth,addReview);

// UPDATE REVIEW
router.put("/:listingId/:reviewId",auth,updateReview);

// DELETE REVIEW
router.delete("/:listingId/:reviewId", auth,deleteReview);

export default router;