import Listing from "../models/Listing.js";

export const addReview = async (req, res) => {
    try {
      const { listingId } = req.params;
      const { userId, rating, comment } = req.body;
  
      if (!userId || !rating || !comment) {
        return res.status(400).json({ message: "Missing fields" });
      }
  
      const listing = await Listing.findById(listingId);
      if (!listing) return res.status(404).json({ message: "Listing not found" });
  
      const already = listing.reviews.find(
        (r) => r.user.toString() === userId
      );
      if (already) {
        return res.status(400).json({ message: "Already reviewed" });
      }
  
      listing.reviews.push({ user: userId, rating, comment });
      await listing.save();
  
      res.json({ message: "Review added" });
    } catch (err) {
      res.status(500).json({ message: " Review Server error" });
    }
  };

  export const updateReview = async (req, res) => {
    try {
      const { listingId, reviewId } = req.params;
      const { rating, comment } = req.body;
  
      const listing = await Listing.findById(listingId);
      if (!listing) return res.status(404).json({ message: "Listing not found" });
  
      const review = listing.reviews.id(reviewId);
      if (!review) return res.status(404).json({ message: "Review not found" });
  
      review.rating = rating;
      review.comment = comment;
  
      await listing.save();
      res.json({ message: "Review updated" });
  
    } catch (err) {
      res.status(500).json({ message: " review update Server error" });
    }
  };

  export const deleteReview = async (req, res) => {
    try {
      const { listingId, reviewId } = req.params;
  
      const listing = await Listing.findById(listingId);
      if (!listing) return res.status(404).json({ message: "Listing not found" });
  
      listing.reviews = listing.reviews.filter(
        (rev) => rev._id.toString() !== reviewId
      );
  
      await listing.save();
      res.json({ message: "Review deleted" });
  
    } catch (err) {
      res.status(500).json({ message: " review delete Server error" });
    }
  };