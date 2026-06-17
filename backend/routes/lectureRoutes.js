import express from "express";
import { createLecture, getLectures } from "../controllers/lectureController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createLecture);
router.get("/", protect, getLectures);

export default router;