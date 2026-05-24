import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
