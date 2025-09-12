import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // normalize
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"], // regex validation
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    avatar: {
      type: String,
      trim: true,
      default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // fallback avatar
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // don't return password by default in queries
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "users");
export default User;
