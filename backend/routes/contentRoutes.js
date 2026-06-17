import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  generateContent,
  //saveContent,
  //getAllContent,
} from "../controllers/contentController.js";

const router = express.Router();

router.post("/generate", protect, generateContent);
//router.post("/save", protect, saveContent);
//router.get("/", protect, getAllContent);

export default router;