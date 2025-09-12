import express from "express";
import {
  deleteUser,
  getAllUser,
  getUser,
  updateUser,
  toggleUserRole
} from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 All routes below require authentication
router.use(authenticate);

// Get a single user by ID
router.get("/:userid", getUser);

// Update user (with avatar upload)
router.put("/:userid", upload.single("file"), updateUser);

// Get all users (Admin only, ideally)
router.get("/", getAllUser);

// Delete a user
router.delete("/:userid", deleteUser);

router.patch("/role/:userid", toggleUserRole);

export default router;
