import express from "express";
import {
  createLecture,
  deleteLecture,
  getLectures,
  updateLecture,
} from "../controllers/lectureController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createLecture);
router.get("/", protect, getLectures);
router.patch("/:id", protect, updateLecture);
router.delete("/:id", protect, deleteLecture);

export default router;