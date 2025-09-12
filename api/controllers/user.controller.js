// controllers/user.controller.js
import cloudinary from "../config/cloudinary.js";
import { handleError } from "../helpers/handleError.js";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";

/**
 * Get single user details
 */
export const getUser = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const user = await User.findById(userid).select("-password").lean().exec();

    if (!user) {
      return next(handleError(404, "User not found."));
    }

    res.status(200).json({
      success: true,
      message: "User data found.",
      user,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

/**
 * Update user profile
 */
export const updateUser = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    const { userid } = req.params;

    const user = await User.findById(userid);
    if (!user) return next(handleError(404, "User not found."));

    // Update basic fields
    user.name = data.name || user.name;
    user.email = data.email || user.email;
    user.bio = data.bio || user.bio;

    // Password update (if provided)
    if (data.password && data.password.length >= 8) {
      const hashedPassword = bcryptjs.hashSync(data.password, 10);
      user.password = hashedPassword;
    }

    // Avatar upload to Cloudinary (if file exists)
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "mern-blog/users",
        resource_type: "auto",
      });

      user.avatar = uploadResult.secure_url;
    }

    await user.save();

    // Exclude password before sending response
    const newUser = user.toObject();
    delete newUser.password;

    res.status(200).json({
      success: true,
      message: "User profile updated successfully.",
      user: newUser,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

/**
 * Get all users (Admin only)
 */
export const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

/**
 * Delete a user (Admin or self)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { userid } = req.params;

    const user = await User.findByIdAndDelete(userid);
    if (!user) return next(handleError(404, "User not found."));

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

/**
 * Toggle user role (Admin only)
 */
export const toggleUserRole = async (req, res, next) => {
  try {
    const { userid } = req.params;

    const user = await User.findById(userid);
    if (!user) return next(handleError(404, "User not found."));

    // Toggle role
    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${user.role}.`,
      role: user.role,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

