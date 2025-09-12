import { getEvn } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { FaRegComment } from "react-icons/fa";

const CommentCount = ({ props }) => {
  const { data, loading, error } = useFetch(
    `${getEvn("VITE_API_URL")}/comment/blog/${props.blogid}/count`,
    {
      method: "get",
      credentials: "include",
    }
  );

  return (
    <button
      type="button"
      className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 
                 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-violet-100 dark:hover:bg-violet-900 
                 transition-colors"
    >
      <FaRegComment className="text-violet-500" />
      {loading ? (
        <span className="text-xs text-gray-500">Loading...</span>
      ) : error ? (
        <span className="text-xs text-red-500">Error</span>
      ) : (
        <span>{data?.count || 0}</span>
      )}
    </button>
  );
};

export default CommentCount;
