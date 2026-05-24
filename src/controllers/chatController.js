import Conversation from "../models/conversations.js";
import Message from "../models/message.js";

/* =========================================================
   START CONVERSATION
========================================================= */
export const start = async (req, res) => {
  try {
    const { userId, ownerId, listingId } = req.body;

    // ================= VALIDATION =================
    if (!userId || !ownerId || !listingId) {
      return res.status(400).json({
        error: "userId, ownerId and listingId required",
      });
    }

    // prevent self chat
    if (userId.toString() === ownerId.toString()) {
      return res.status(400).json({
        error: "Cannot create chat with yourself",
      });
    }

    // ================= CHECK EXISTING =================
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, ownerId] },
      listingId,
    });

    // ================= CREATE NEW =================
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, ownerId],
        listingId,
      });
    }

    return res.status(200).json(conversation);

  } catch (err) {
    console.log("START CHAT ERROR:", err);

    return res.status(500).json({
      error: "Server error",
    });
  }
};

/* =========================================================
   GET ALL CONVERSATIONS
========================================================= */
export const conversationId = async (req, res) => {
  try {
    const { userId } = req.params;

    // ================= GET CONVERSATIONS =================
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email role")
      .populate("listingId", "title city price image")
      .sort({ updatedAt: -1 })
      .lean();

    // ================= FORMAT RESPONSE =================
    const formatted = conversations.map((conversation) => {

      // other user find
      const otherUser = conversation.participants.find(
        (participant) =>
          participant._id.toString() !== userId.toString()
      );

      return {
        _id: conversation._id,

        lastMessage: conversation.lastMessage || "",

        updatedAt: conversation.updatedAt,

        otherUserId: otherUser?._id || null,

        otherUserName:
          otherUser?.name || "Unknown User",

        otherUserRole:
          otherUser?.role || "user",

        listing: conversation.listingId || null,
      };
    });

    // console.log("FORMATTED CONVERSATIONS:", formatted);

    return res.status(200).json(formatted);

  } catch (err) {
    // console.log("GET CONVERSATIONS ERROR:", err);

    return res.status(500).json({
      error: "Server error",
    });
  }
};

/* =========================================================
   GET ALL MESSAGES OF CONVERSATION
========================================================= */
export const messageconversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // ================= CHECK =================
    const conversationExists =
      await Conversation.findById(conversationId);

    if (!conversationExists) {
      return res.status(404).json({
        error: "Conversation not found",
      });
    }

    // ================= GET MESSAGES =================
    const messages = await Message.find({
      conversationId,
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);

  } catch (err) {
    console.log("GET MESSAGES ERROR:", err);

    return res.status(500).json({
      error: "Chat server error",
    });
  }
};

/* =========================================================
   SEND MESSAGE
========================================================= */
export const messages = async (req, res) => {
  try {
    const {
      conversationId,
      sender,
      text,
    } = req.body;

    // ================= VALIDATION =================
    if (!conversationId || !sender || !text) {
      return res.status(400).json({
        error:
          "conversationId, sender and text required",
      });
    }

    // empty spaces block
    if (!text.trim()) {
      return res.status(400).json({
        error: "Message cannot be empty",
      });
    }

    // ================= CHECK CONVERSATION =================
    const conversation =
      await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        error: "Conversation not found",
      });
    }

    // ================= CREATE MESSAGE =================
    const message = await Message.create({
      conversationId,
      sender,
      text: text.trim(),
    });

    // ================= UPDATE LAST MESSAGE =================
    conversation.lastMessage = text.trim();

    conversation.updatedAt = new Date();

    await conversation.save();

    return res.status(201).json(message);

  } catch (err) {
    console.log("SEND MESSAGE ERROR:", err);

    return res.status(500).json({
      error: "Chat server error",
    });
  }
};