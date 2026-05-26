// ================== IMPORTS ==================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";

import connectDB from "./config/db.js";

import indexRoutes from "./routes/index.js";
import listingRoutes from "./routes/listings.js";
import authRoutes from "./routes/auth.js";
import ownerRoutes from "./routes/owner.js";
import reviewRoutes from "./routes/reviews.js";
import wishlistRoutes from "./routes/wishlist.js";
import chatRoutes from "./routes/chat.js";
import profileRoutes from "./routes/profile.js";

dotenv.config();

// ================== APP ==================
const app = express();
const __dirname = path.resolve();

// ================== DB ==================
connectDB();

// ================== MIDDLEWARE ==================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rentify-frontend-umber.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(hpp());

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

app.disable("x-powered-by");

// ================== RATE LIMIT ==================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: "Too many requests — try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// ================== ROUTES ==================
app.use("/api", indexRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);

app.get("/health", (req, res) => {
  res.send("ok");
});

// ================== SERVER ==================
const server = http.createServer(app);

// ================== SOCKET ==================
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://rentify-frontend-umber.vercel.app",
    ],
    credentials: true,
  },
});

// ================== ONLINE USERS ==================
const onlineUsers = new Map();

// ================== SOCKET EVENTS ==================
io.on("connection", (socket) => {
  // console.log("🔌 Socket connected:", socket.id);

  // ================== USER ONLINE ==================
  socket.on("user_online", (userId) => {
    if (!userId) return;

    const id = userId.toString();

    socket.userId = id;

    // store latest socket id
    onlineUsers.set(id, socket.id);

    // console.log("✅ User Online:", id);

    // notify all users
    io.emit("update_online_status", {
      userId: id,
      status: "online",
    });
  });

  // ================== JOIN CONVERSATION ==================
  socket.on("join_conversation", (conversationId) => {
    if (!conversationId) return;

    socket.join(conversationId);

    console.log(
      `📥 Socket ${socket.id} joined room ${conversationId}`
    );
  });

  // ================== SEND MESSAGE ==================
  socket.on("send_message", (data) => {
    if (!data?.conversationId) return;

    socket
      .to(data.conversationId)
      .emit("receive_message", data);
  });

  // ================== REQUEST ONLINE STATUS ==================
  socket.on("request_online_status", () => {
    for (const [userId] of onlineUsers.entries()) {
      socket.emit("update_online_status", {
        userId,
        status: "online",
      });
    }
  });

  // ================== DISCONNECT ==================
  socket.on("disconnect", () => {
    // console.log("❌ Socket disconnected:", socket.id);

    if (!socket.userId) return;

    const userId = socket.userId.toString();

    // remove user
    onlineUsers.delete(userId);

    // console.log("🚪 User Offline:", userId);

    // notify everyone
    io.emit("update_online_status", {
      userId,
      status: "offline",
    });
  });
});

// ================== START SERVER ==================
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Server failed to start:",
      error.message
    );
    process.exit(1);
  }
};

startServer();