import express from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategory,
  showCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import { onlyAdmin } from "../middleware/onlyadmin.middleware.js";

const router = express.Router();

// 🔹 Admin-only actions
router.post("/", onlyAdmin, addCategory);            // Create category
router.put("/:categoryid", onlyAdmin, updateCategory); // Update category
router.delete("/:categoryid", onlyAdmin, deleteCategory); // Delete category
router.get("/single/:categoryid", onlyAdmin, showCategory);    // Get single category (admin only)

// 🔹 Public action
router.get("/all-category", getAllCategory); // Get all categories

export default router;
