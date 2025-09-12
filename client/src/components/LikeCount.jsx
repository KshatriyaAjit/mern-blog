import { getEvn } from '@/helpers/getEnv';
import { showToast } from '@/helpers/showToast';
import { useFetch } from '@/hooks/useFetch';
import React, { useEffect, useState } from 'react';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useSelector } from 'react-redux';
import api from '@/utils/api';

const LikeCount = ({ props }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const { user, token, isLoggedIn } = useSelector((state) => state.auth);

  const { data: blogLikeCount } = useFetch(
    `/blog-like/likes/${props.blogid}/${isLoggedIn ? user._id : ''}`,
    { method: 'get' },
    [props.blogid, isLoggedIn, user?._id]
  );

  useEffect(() => {
    if (blogLikeCount) {
      setLikeCount(blogLikeCount.likecount);
      setHasLiked(blogLikeCount.isUserliked);
    }
  }, [blogLikeCount]);

  const handleLike = async () => {
    try {
      if (!isLoggedIn) {
        return showToast('error', 'Please login into your account.');
      }

      if (!props.blogid) {
        return showToast('error', 'Blog ID missing.');
      }

      const response = await api.post(`/blog-like/like`, {
        blogid: props.blogid,
      });

      setLikeCount(response.data.likecount);
      setHasLiked(response.data.message === "Blog liked");
    } catch (error) {
      showToast('error', error.response?.data?.message || error.message);
    }
  };

  return (
    <button
      onClick={handleLike}
      type="button"
      className="flex items-center gap-2 px-3 py-1.5 
                 rounded-full border border-gray-200 dark:border-gray-700 
                 text-gray-700 dark:text-gray-200 text-sm sm:text-base
                 hover:bg-gray-100 dark:hover:bg-gray-800 
                 transition-all duration-200"
    >
      {!hasLiked ? (
        <FaRegHeart className="text-lg sm:text-xl" />
      ) : (
        <FaHeart className="text-lg sm:text-xl text-red-500" />
      )}
      <span className="font-medium">{likeCount}</span>
    </button>
  );
};

export default LikeCount;
