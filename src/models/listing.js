import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    city: String,
    area: String,
    address: String,
    price: Number,
    images: [String],
    video: { type: String, default: "" },
    amenities: [String],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: ["Boys", "Girls", "Family", "PG", "Hostel", "Flat"],
      required: false
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now }
      },
    ],
  views: { type: Number, default: 0 },

    
  },
  { timestamps: true }
);

// FIX: Prevent Overwrite Error
export default mongoose.models.Listing || mongoose.model("Listing", listingSchema);
