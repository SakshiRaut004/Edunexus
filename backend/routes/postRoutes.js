import express from "express";
import { createPost, getPosts } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { toggleLike, addComment } from "../controllers/postController.js";


const router = express.Router();

router.post("/", protect, createPost);
router.get("/", protect, getPosts);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);

export default router;