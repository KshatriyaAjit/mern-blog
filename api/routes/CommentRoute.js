import express from "express";
import {
  addComment,
  commentCount,
  deleteComment,
  getAllComments,
  getComments,
} from "../controllers/comment.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Authenticated users
router.post("/", authenticate, addComment);              // Add a comment
router.delete("/:commentid", authenticate, deleteComment); // Delete a comment

// 🔹 Public
router.get("/blog/:blogid", getComments);       // Get comments of a blog
router.get("/blog/:blogid/count", commentCount); // Get comment count for a blog

// 🔹 Admin (or for moderation panel)
router.get("/", authenticate, getAllComments);  // Get all comments (admin/moderation)

export default router;
