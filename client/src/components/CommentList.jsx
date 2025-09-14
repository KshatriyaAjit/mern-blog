import { getEvn } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import usericon from "@/assets/images/user.png";
import moment from "moment";
import { useSelector } from "react-redux";

const CommentList = ({ props }) => {
  const { user } = useSelector((state) => state.auth);
  const { data, loading, error } = useFetch(
    `${getEvn("VITE_API_URL")}/api/comment/blog/${props.blogid}`,
    {
      method: "get",
      credentials: "include",
    }
  );

  if (loading) return <div className="text-gray-500">Loading comments...</div>;
  if (error)
    return (
      <div className="text-red-500 text-sm">
        Failed to load comments. Try again later.
      </div>
    );

  const comments = data?.comments || [];
  const totalCount = props.newComment
    ? comments.length + 1
    : comments.length;

  return (
    <div>
      <h4 className="text-2xl font-bold mb-4">
        <span className="me-2">{totalCount}</span>
        {totalCount === 1 ? "Comment" : "Comments"}
      </h4>

      <div className="space-y-4">
        {/* Show new comment instantly */}
        {props.newComment && (
          <div className="flex gap-3 p-3 rounded-lg bg-violet-50 dark:bg-violet-900/30 shadow-sm">
            <Avatar>
              <AvatarImage src={user?.user?.avatar || usericon} />
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {user?.user?.name || "You"}
              </p>
              <p className="text-xs text-gray-500">
                {moment(props.newComment?.createdAt).format("DD-MM-YYYY")}
              </p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {props.newComment?.comment}
              </p>
            </div>
          </div>
        )}

        {/* Existing comments from backend */}
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm"
            >
              <Avatar>
                <AvatarImage src={comment?.user?.avatar || usericon} />
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {comment?.user?.name || "Unknown User"}
                </p>
                <p className="text-xs text-gray-500">
                  {moment(comment?.createdAt).format("DD-MM-YYYY")}
                </p>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {comment?.comment}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default CommentList;
