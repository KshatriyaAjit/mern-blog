import { handleError } from "../helpers/handleError.js";
import Comment from "../models/comment.model.js";

// ✅ Add a new comment
export const addComment = async (req, res, next) => {
  try {
    const { blogid, comment } = req.body;
    const user = req.user._id;

    if (!user || !blogid || !comment) {
      return next(handleError(400, "All fields are required (user, blogid, comment)."));
    }

    const newComment = new Comment({ user, blogid, comment });
    await newComment.save();

    res.status(201).json({
      success: true,
      message: "Comment submitted successfully.",
      comment: await newComment.populate("user", "name avatar"),
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Get comments for a specific blog
export const getComments = async (req, res, next) => {
  try {
    const { blogid } = req.params;

    if (!blogid) {
      return next(handleError(400, "Blog ID is required."));
    }

    const comments = await Comment.find({ blogid })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, comments });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Get comment count for a blog
export const commentCount = async (req, res, next) => {
  try {
    const { blogid } = req.params;

    if (!blogid) {
      return next(handleError(400, "Blog ID is required."));
    }

    const count = await Comment.countDocuments({ blogid });

    res.status(200).json({ success: true, count });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Get all comments (Admin: all / User: own)
export const getAllComments = async (req, res, next) => {
  try {
    const user = req.user;

    let comments = [];
    if (user.role === "admin") {
      comments = await Comment.find()
        .populate("blogid", "title")
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .lean();
    } else {
      comments = await Comment.find({ user: user._id })
        .populate("blogid", "title")
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .lean();
    }

    res.status(200).json({ success: true, comments });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Update a comment (only owner or admin)
export const updateComment = async (req, res, next) => {
  try {
    const { commentid } = req.params;
    const { comment } = req.body;
    const user = req.user;

    if (!commentid || !comment) {
      return next(handleError(400, "Comment ID and new content are required."));
    }

    const existing = await Comment.findById(commentid);
    if (!existing) {
      return next(handleError(404, "Comment not found."));
    }

    // Only admin or owner can update
    if (user.role !== "admin" && existing.user.toString() !== user._id.toString()) {
      return next(handleError(403, "You are not authorized to update this comment."));
    }

    existing.comment = comment;
    await existing.save();

    res.status(200).json({
      success: true,
      message: "Comment updated successfully.",
      comment: await existing.populate("user", "name avatar"),
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Delete a comment (only owner or admin)
export const deleteComment = async (req, res, next) => {
  try {
    const { commentid } = req.params;
    const user = req.user;

    const existing = await Comment.findById(commentid);
    if (!existing) {
      return next(handleError(404, "Comment not found."));
    }

    // Only admin or owner can delete
    if (user.role !== "admin" && existing.user.toString() !== user._id.toString()) {
      return next(handleError(403, "You are not authorized to delete this comment."));
    }

    await existing.deleteOne();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
