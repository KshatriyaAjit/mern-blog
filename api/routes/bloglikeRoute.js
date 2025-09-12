import express from "express";
import { doLike, likeCount } from "../controllers/blogLike.controller.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 User actions (protected)
router.post("/like", authenticate, doLike); // Like / Unlike a blog

router.get("/likes/:blogid", likeCount);                // only count
router.get("/likes/:blogid/:userid", likeCount);        // count + check if liked

export default router;
