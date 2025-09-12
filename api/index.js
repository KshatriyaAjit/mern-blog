import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";

import AuthRoute from "./routes/authRoutes.js";
import UserRoute from "./routes/UserRoute.js";

import CategoryRoute from "./routes/CategoryRoute.js";
import BlogRoute from "./routes/blogRoute.js";
import CommentRoute from "./routes/CommentRoute.js";
import BlogLikeRoute from "./routes/bloglikeRoute.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"], // allow both dev & prod
    credentials: true,
  })
);

// Routes
app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/blog", BlogRoute);
app.use("/api/comment", CommentRoute);
app.use("/api/blog-like", BlogLikeRoute);

// Global Error Handler
// Global error handler
app.use((err, req, res, next) => {
  console.error("Error handler:", err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});


// Database & Server Init
mongoose
  .connect(process.env.MONGODB_URI, { dbName: "mernBlog" })
  .then(() => {
    console.log("✅ Database connected.");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed.", err);
    process.exit(1); // stop app if db fails
  });
