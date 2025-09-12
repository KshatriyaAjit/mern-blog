import express from "express";
import {
  addBlog,
  deleteBlog,
  editBlog,
  getAllBlogs,
  getBlog,
  getBlogByCategory,
  getRelatedBlog,
  search,
  showAllBlog,
  updateBlog,
} from "../controllers/blog.controller.js"
import upload from "../middleware/multer.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Admin/User actions (protected)
router.post("/add", authenticate, upload.single("file"), addBlog);       // Create blog
router.get("/edit/:blogid", authenticate, editBlog);                     // Get blog for edit
router.put("/update/:blogid", authenticate, upload.single("file"), updateBlog); // Update blog
router.delete("/delete/:blogid", authenticate, deleteBlog);              // Delete blog
router.get("/get-all", authenticate, showAllBlog);                       // Get all blogs (admin dashboard)

// 🔹 Public access
router.get("/blogs", getAllBlogs);                                       // All blogs (public)
router.get("/get-blog/:slug", getBlog);                                  // Single blog by slug
router.get("/get-related-blog/:category/:blog", getRelatedBlog);         // Related blogs
router.get("/get-blog-by-category/:category", getBlogByCategory);        // Blogs by category
router.get("/search", search);                                           // Search blogs

export default router;
