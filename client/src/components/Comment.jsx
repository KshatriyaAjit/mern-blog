import React, { useState } from "react";
import { FaComments } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { showToast } from "@/helpers/showToast";
import { getEvn } from "@/helpers/getEnv";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useSelector } from "react-redux";
import { RouteSignin } from "@/helpers/RouteName";
import CommentList from "./CommentList";
import { Link } from "react-router-dom";

const Comment = ({ props }) => {
  const [newComment, setNewComment] = useState();
  const { user, token, isLoggedIn } = useSelector((state) => state.auth);

  const formSchema = z.object({
    comment: z.string().min(3, "Comment must be at least 3 characters long."),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(values) {
    try {
      const response = await fetch(`${getEvn("VITE_API_URL")}/comment`, {
        method: "post",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...values, blogid: props.blogid }),
      });

      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }
      setNewComment(data.comment);
      form.reset();
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    }
  }

  return (
    <div className="mt-8">
      {/* Title */}
      <h4 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        <FaComments className="text-violet-500" /> Comments
      </h4>

      {/* Comment Form */}
      {user && isLoggedIn ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="mb-4">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Add a Comment
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your comment..."
                        className="resize-none min-h-[100px] rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-900 dark:text-gray-100 transition"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-5 py-2 shadow-md transition"
            >
              Submit
            </Button>
          </form>
        </Form>
      ) : (
        <div className="mt-4">
          <Button
            asChild
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-5 py-2 shadow-md transition"
          >
            <Link to={RouteSignin}>Sign in to Comment</Link>
          </Button>
        </div>
      )}

      {/* Comment List */}
      <div className="mt-6">
        <CommentList props={{ blogid: props.blogid, newComment }} />
      </div>
    </div>
  );
};

export default Comment;
