import Wishlist from "../models/wishlist.js";
import Listing from "../models/listing.js";

export const wishlistUserId = async (req, res) => {
  try {

    const userId = req.user.id;

    const items = await Wishlist.find({ userId });

    const wishlistIds = items.map((i) =>
      i.listingId.toString()
    );

    return res.json(wishlistIds);

  } catch (err) {

    return res.status(500).json({
      error: "Server error",
    });
  }
};

export const wishlistRoom = async (req, res) => {
    try {
      const { ids } = req.body;
  
      const listings = await Listing.find({ _id: { $in: ids } });
  
      res.json(listings);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  };

 export const addWishlist = async (req, res) => {
  try {

    const userId = req.user.id;
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({
        error: "listingId required",
      });
    }

    const exists = await Wishlist.findOne({
      userId,
      listingId,
    });

    if (exists) {
      return res.json({
        message: "Already in wishlist",
      });
    }

    const newItem = new Wishlist({
      userId,
      listingId,
    });

    await newItem.save();

    return res.json({
      message: "Added to wishlist",
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      error: "wishlist add server error",
    });
  }
};

  export const removeWishlist = async (req, res) => {
  try {

    const userId = req.user.id;
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({
        error: "listingId required",
      });
    }

    await Wishlist.findOneAndDelete({
      userId,
      listingId,
    });

    return res.json({
      message: "Removed from wishlist",
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      error: "wishlist remove server error",
    });
  }
};