import express from "express";
import multer from "multer";
import {
  uploadResultsPDF,
  getResults,
} from "../controllers/resultsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// store file in memory (IMPORTANT)
const upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/", protect, getResults);

router.post(
  "/upload",
  protect,
  upload.single("pdf"),
  uploadResultsPDF
);

export default router;