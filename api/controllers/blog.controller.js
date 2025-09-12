import cloudinary, { streamUpload } from "../config/cloudinary.js";
import { handleError } from "../helpers/handleError.js";
import Blog from "../models/blog.model.js";
import { encode } from "entities";
import Category from "../models/category.model.js";


// ✅ Add Blog
export const addBlog = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);

    let featuredImage = "";
    if (req.file) {
      try {
        const uploadResult = await streamUpload(req.file.buffer, "mern-blog");
        featuredImage = uploadResult.secure_url;

      } catch (error) {
        return next(handleError(500, "Image upload failed"));
      }
    }

    const blog = new Blog({
      author: data.author,
      category: data.category,
      title: data.title.trim(),
      slug: `${data.slug}-${Date.now()}`, // ✅ Better unique slug
      featuredImage,
      blogContent: encode(data.blogContent),
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: "Blog added successfully.",
      blog,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Edit Blog (Get details for editing)
export const editBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const blog = await Blog.findById(blogid).populate("category", "name");
    if (!blog) return next(handleError(404, "Blog not found."));

    res.status(200).json({ blog });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Update Blog
export const updateBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const data = JSON.parse(req.body.data);

    const blog = await Blog.findById(blogid);
    if (!blog) return next(handleError(404, "Blog not found."));

    blog.category = data.category;
    blog.title = data.title.trim();
    blog.slug = data.slug || blog.slug;
    blog.blogContent = encode(data.blogContent);

    if (req.file) {
      try {
        const uploadResult = await streamUpload(req.file.buffer, "mern-blog");
        featuredImage = uploadResult.secure_url;

      } catch (error) {
        return next(handleError(500, "Image upload failed"));
      }
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      blog,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Delete Blog
export const deleteBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const blog = await Blog.findById(blogid);

    if (!blog) return next(handleError(404, "Blog not found."));

    await Blog.findByIdAndDelete(blogid);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Show Blogs (Admin/User Wise)
export const showAllBlog = async (req, res, next) => {
  try {
    const user = req.user;
    let blogs;

    if (user.role === "admin") {
      blogs = await Blog.find()
        .populate("author", "name avatar role")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .lean();
    } else {
      blogs = await Blog.find({ author: user._id })
        .populate("author", "name avatar role")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .lean();
    }

    res.status(200).json({ blogs });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Get Single Blog
export const getBlog = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug })
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .lean();

    if (!blog) return next(handleError(404, "Blog not found."));

    res.status(200).json({ blog });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Get Related Blogs
export const getRelatedBlog = async (req, res, next) => {
  try {
    const { category, blog } = req.params;

    const categoryData = await Category.findOne({ slug: category });
    if (!categoryData) return next(handleError(404, "Category not found."));

    const relatedBlogs = await Blog.find({
      category: categoryData._id,
      slug: { $ne: blog },
    })
      .limit(5) // ✅ Limit for performance
      .lean();

    res.status(200).json({ relatedBlogs });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Get Blogs by Category
export const getBlogByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const categoryData = await Category.findOne({ slug: category });
    if (!categoryData) return next(handleError(404, "Category not found."));

    const blogs = await Blog.find({ category: categoryData._id })
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .lean();

    res.status(200).json({ blogs, categoryData });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Search Blog
export const search = async (req, res, next) => {
  try {
    const { q } = req.query;

const blogs = await Blog.find({
  $or: [
    { title: { $regex: q, $options: "i" } },
    { slug: { $regex: q, $options: "i" } },
    { description: { $regex: q, $options: "i" } },
    { content: { $regex: q, $options: "i" } }
  ]
})
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .lean();

    res.status(200).json({ blogs });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Get All Blogs (Public)
export const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ blogs });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
