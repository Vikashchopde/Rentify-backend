// src/routes/auth.js
import express from "express";
import { register,login,logout,me } from "../controllers/authController.js";

const router = express.Router();

/* ======================================================
   REGISTER USER
====================================================== */
router.post("/register",register);

/* ======================================================
   LOGIN USER
====================================================== */
router.post("/login",login);

   //LOGOUT USER
router.post("/logout",logout );

 // GET CURRENT LOGGED-IN USER
 router.get("/me",me);

 export default router;