import Comment from '@/components/Comment'
import CommentCount from '@/components/CommentCount'
import CommentList from '@/components/CommentList'
import LikeCount from '@/components/LikeCount'
import Loading from '@/components/Loading'
import RelatedBlog from '@/components/RelatedBlog'
import { Avatar } from '@/components/ui/avatar'
import { getEvn } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import { AvatarImage } from '@radix-ui/react-avatar'
import { decode } from 'entities'
import moment from 'moment'
import React from 'react'
import { useParams } from 'react-router-dom'

const SingleBlogDetails = () => {
  const { blog, category } = useParams()

  const { data, loading, error } = useFetch(
    `${getEvn('VITE_API_URL')}/blog/get-blog/${blog}`,
    {
      method: 'get',
      credentials: 'include',
    },
    [blog, category]
  )

  if (loading) return <Loading />

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
      {/* Blog Content */}
      {data && data.blog && (
        <div className="md:w-[70%] w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900 dark:text-white leading-snug">
            {data.blog.title}
          </h1>

          {/* Author + Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={data.blog.author.avatar} />
              </Avatar>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {data.blog.author.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {moment(data.blog.createdAt).format('DD MMM YYYY')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <LikeCount props={{ blogid: data.blog._id }} />
              <CommentCount props={{ blogid: data.blog._id }} />
            </div>
          </div>

          {/* Featured Image */}
          <div className="my-6">
            <img
              src={data.blog.featuredImage}
              alt="Blog featured"
              className="w-full rounded-2xl shadow-md object-cover"
            />
          </div>

          {/* Blog Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: decode(data.blog.blogContent) || '',
            }}
          />

          {/* Comment Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Leave a Comment
            </h3>
            <Comment props={{ blogid: data.blog._id }} />
          </div>
        </div>
      )}

      {/* Related Blogs */}
      <div className="md:w-[30%] w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-5 h-fit">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Related Blogs
        </h2>
        <RelatedBlog props={{ category: category, currentBlog: blog }} />
      </div>
    </div>
  )
}

export default SingleBlogDetails
