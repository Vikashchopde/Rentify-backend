import express from "express";
import auth from "../middleware/auth.js";
import requireRole from "../middleware/requireRole.js";
import upload from "../middleware/upload.js";
import { listingCreate,listingUpdate,listingDelete, listingFilter, listingsingle, OwnerListing } from "../controllers/listingController.js";

const router = express.Router();

// -----------------------------------------------------------------------------
// CREATE LISTING (with images + video)
// -----------------------------------------------------------------------------
router.post(
  "/", auth,requireRole("owner"),
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  listingCreate
);

// -----------------------------------------------------------------------------
// UPDATE LISTING (Owner only) + optional new images/video
// -----------------------------------------------------------------------------
router.put( "/:id", auth, requireRole("owner"),
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
 listingUpdate
);

// -----------------------------------------------------------------------------
// DELETE LISTING (Owner only)
// -----------------------------------------------------------------------------
router.delete("/:id", auth, requireRole("owner"),listingDelete );


// -----------------------------------------------------------------------------
// GET ALL LISTINGS (with filters)
// -----------------------------------------------------------------------------
router.get("/",listingFilter );



// -----------------------------------------------------------------------------
// GET SINGLE LISTING
// -----------------------------------------------------------------------------
router.get("/:id",auth,listingsingle );


router.get(
  "/owner/my",
  auth,
  requireRole("owner"),
 OwnerListing
);

export default router;
