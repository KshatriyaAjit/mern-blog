import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,   // ✅ this already creates index
      lowercase: true,
      trim: true,
    },
    blogContent: {
      type: String,
      required: [true, "Blog content is required"],
      trim: true,
    },
    featuredImage: {
      type: String,
      required: [true, "Featured image is required"],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

// Indexes for better search performance
// Full-text search only on title and blogContent
blogSchema.index({ title: "text", blogContent: "text" });

// Normal index for tags (for faster tag queries like $in)
blogSchema.index({ tags: 1 });


// Virtual field for like count
blogSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

const Blog = mongoose.model("Blog", blogSchema, "blogs");
export default Blog;
