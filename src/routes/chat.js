import express from "express";
import auth from "../middleware/auth.js";
import { start,conversationId,messageconversation,messages } from "../controllers/chatController.js";

const router = express.Router();

router.post("/start",auth ,start);

router.get("/conversations/:userId", auth,conversationId);

router.get("/messages/:conversationId",auth ,messageconversation);

router.post("/message",auth ,messages);
  
export default router;