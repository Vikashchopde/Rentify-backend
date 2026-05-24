import express from "express";
import auth from "../middleware/auth.js";
import requireSameUser from "../middleware/requireSameUser.js";
import { userProfile, updateUserProfile } from "../controllers/userProfileController.js";

const router = express.Router();

/* ======================================================
   GET USER PROFILE
====================================================== */
router.get("/:userId",auth,requireSameUser ,userProfile);


/* ======================================================
   UPDATE USER PROFILE
====================================================== */
router.put("/:userId", auth,requireSameUser,updateUserProfile);
  
export default router;