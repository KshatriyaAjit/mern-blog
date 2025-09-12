import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaRegCalendarAlt } from "react-icons/fa";
import usericon from "@/assets/images/user.png";
import moment from "moment";
import { Link } from "react-router-dom";
import { RouteBlogDetails } from "@/helpers/RouteName";

const BlogCard = ({ props }) => {
  return (
    <Link
      to={RouteBlogDetails(props.category.slug, props.slug)}
      className="block h-full"
    >
      <Card className="group overflow-hidden rounded-2xl border 
      border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg 
      transition duration-300 bg-white dark:bg-gray-900 h-full  
      hover:border-violet-600/50 dark:hover:border-violet-500/40 
      hover:shadow-[0_0_12px_rgba(139,92,246,0.25)] dark:hover:shadow-[0_0_12px_rgba(139,92,246,0.35)]
      ">
        <CardContent className="p-4 sm:p-5 flex flex-col h-full">
          {/* Author + Role */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 max-w-[70%] min-w-0">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={props.author.avatar || usericon} />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {props.author.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              {/* author name truncated */}
              <span className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                {props.author.name}
              </span>
            </div>

            {props.author.role === "admin" && (
              <Badge
                variant="outline"
                className="bg-violet-500/90 text-white border-none px-2 py-1 text-xs rounded-md"
              >
                Admin
              </Badge>
            )}
          </div>

          {/* Featured Image (fixed height) */}
          <div className="my-4 relative overflow-hidden rounded-xl flex-shrink-0">
            <img
              src={props.featuredImage}
              alt={props.title}
              className="rounded-xl w-full h-48 sm:h-56 object-cover transform group-hover:scale-105 transition duration-500"
            />
          </div>

          {/* Meta + Title (flexible area with stable title height) */}
          <div className="flex flex-col flex-1">
            <p className="flex items-center gap-2 mb-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <FaRegCalendarAlt className="shrink-0" />
              <span>{moment(props.createdAt).format("DD-MM-YYYY")}</span>
            </p>

            {/* 
              line-clamp-2 ensures at most 2 lines.
              min-h-[3rem] keeps a stable visual height so cards match.
              If you don't have Tailwind's line-clamp plugin enabled, the
              min-height still preserves consistent card sizing.
            */}
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 overflow-hidden min-h-[3rem]">
              {props.title}
            </h2>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;
