import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, enum: ["user", "owner"], default: "user" },
    phone: String,
    avatar: String,
    bio: String,
    profileImage: {
      type: String,
      default: ""
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],

  },
  { timestamps: true }
);

// FIX: Prevent Overwrite Error
export default mongoose.models.User || mongoose.model("User", userSchema);
