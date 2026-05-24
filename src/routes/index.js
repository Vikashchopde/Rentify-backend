import express from "express";
// import User from "../models/user";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API working" });
});

export default router;
