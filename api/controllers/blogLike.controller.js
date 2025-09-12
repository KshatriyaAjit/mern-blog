import { handleError } from "../helpers/handleError.js";
import BlogLike from "../models/bloglike.model.js";


export const doLike = async (req, res, next) => {
    try {
        const blogid = req.body.blogid;
        const user = req.user._id; 

        if (!user || !blogid) {
            return next(handleError(400, "User ID and Blog ID are required"));
        }

      
        const existingLike = await BlogLike.findOne({ user, blogid });

        if (existingLike) {
          
            await BlogLike.findByIdAndDelete(existingLike._id);
        } else {
          
            await BlogLike.create({ user, blogid });
        }

  
        const likecount = await BlogLike.countDocuments({ blogid });

        res.status(200).json({
            success: true,
            likecount,
            isUserliked: !existingLike,
            message: existingLike ? "Blog unliked" : "Blog liked"
        });

    } catch (error) {
        next(handleError(500, error.message));
    }
};


export const likeCount = async (req, res, next) => {
    try {
        const { blogid, userid } = req.params;

        if (!blogid) {
            return next(handleError(400, "Blog ID is required"));
        }

      
        const likecount = await BlogLike.countDocuments({ blogid });

      
        const isUserliked = userid 
            ? await BlogLike.exists({ blogid, user: userid })
            : false;

        res.status(200).json({
            success: true,
            likecount,
            isUserliked: !!isUserliked
        });

    } catch (error) {
        next(handleError(500, error.message));
    }
};
