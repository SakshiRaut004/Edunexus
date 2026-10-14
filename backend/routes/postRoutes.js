import express from "express";
import {
  createPost,
  deletePost,
  getPosts,
  toggleLike,
  addComment,
  updatePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protect, createPost);
router.get("/", protect, getPosts);
router.patch("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);

export default router;