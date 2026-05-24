import express from "express";
import auth from "../middleware/auth.js";
import requireSameUser from "../middleware/requireSameUser.js";
import { owner, updateOwnerProfile } from "../controllers/ownerController.js";


const router = express.Router();

// GET Owner Info + All Their Listings
router.get("/:ownerId",auth,owner);
router.put("/:ownerId", auth, updateOwnerProfile);

export default router;
