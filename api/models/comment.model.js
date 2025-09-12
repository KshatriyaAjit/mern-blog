import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    blogid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Blog",
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 500, // prevent overly long comments
    },
    isEdited: {
      type: Boolean,
      default: false, // useful if you allow editing comments
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema, "comments");
export default Comment;
