import { handleError } from "../helpers/handleError.js";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import admin from "../config/firebaseAdmin.js";

// ---------------- Register ----------------
export const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return next(handleError(409, "User already registered."));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Registration successful.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ---------------- Login ----------------
export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(handleError(400, "Email and password are required."));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(handleError(404, "Invalid login credentials."));
    }

    if (!user.password) {
      return next(handleError(400, "This account doesn't have a password. Use Google login."));
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return next(handleError(401, "Invalid login credentials."));
    }

    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, role : user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    const newUser = user.toObject();
    delete newUser.password;

    res.status(200).json({
      success: true,
      user: newUser,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ---------------- Google Login ----------------


export const GoogleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return next(handleError(400, "ID Token is required"));

    // ✅ Verify token with Firebase Admin
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { name, email, picture } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(password, 10);

      user = new User({
        name,
        email,
        password: hashedPassword,
        avatar: picture,
      });

      await user.save();
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    const newUser = user.toObject();
    delete newUser.password;

    res.status(200).json({
      success: true,
      user: newUser,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    next(handleError(500, error.message));
  }
};


// ---------------- Logout ----------------
export const Logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ---------------- Me (get profile) ----------------
export const Me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return next(handleError(404, "User not found."));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ---------------- Update Profile ----------------
export const UpdateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updateData = { name, email };

    // ✅ If user uploaded a file, upload it to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        {
          folder: "avatars", // optional folder in Cloudinary
          resource_type: "image",
        },
        async (error, uploadResult) => {
          if (error) return next(handleError(500, "Cloudinary upload failed"));

          updateData.avatar = uploadResult.secure_url;

          // ✅ Update user in DB after upload
          const user = await User.findByIdAndUpdate(req.user._id, updateData, {
            new: true,
          }).select("-password");

          if (!user) return next(handleError(404, "User not found."));

          res.status(200).json({
            success: true,
            user,
            message: "Profile updated successfully.",
          });
        }
      );

      // ✅ Write file buffer to Cloudinary stream
      result.end(req.file.buffer);
    } else {
      // ✅ No avatar uploaded, just update name/email
      const user = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
      }).select("-password");

      if (!user) return next(handleError(404, "User not found."));

      res.status(200).json({
        success: true,
        user,
        message: "Profile updated successfully.",
      });
    }
  } catch (error) {
    next(handleError(500, error.message));
  }
};
// ---------------- Update Password ----------------
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(handleError(400, "Current and new password are required."));
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return next(handleError(404, "User not found."));
    }

    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(handleError(401, "Current password is incorrect."));
    }

    user.password = bcryptjs.hashSync(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
