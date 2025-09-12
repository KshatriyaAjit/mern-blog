import { getEvn } from '@/helpers/getEnv'
import { RouteBlogDetails } from '@/helpers/RouteName'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { Link } from 'react-router-dom'

const RelatedBlog = ({ props }) => {
  const { data, loading, error } = useFetch(
    `${getEvn('VITE_API_URL')}/blog/get-related-blog/${props.category}/${props.currentBlog}`,
    {
      method: 'get',
      credentials: 'include',
    }
  )

  if (loading)
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        Loading...
      </div>
    )

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">
        Related Blogs
      </h2>

      <div className="space-y-4">
        {data && data.relatedBlogs && data.relatedBlogs.length > 0 ? (
          data.relatedBlogs.map((blog) => (
            <Link
              key={blog._id}
              to={RouteBlogDetails(props.category, blog.slug)}
              className="block"
            >
              <div className="flex items-center gap-3 p-2 rounded-lg border 
                              border-gray-200 dark:border-gray-700 
                              hover:shadow-md hover:bg-gray-50 
                              dark:hover:bg-gray-800 transition-all duration-200">
                <img
                  className="w-[100px] h-[70px] object-cover rounded-md shadow-sm"
                  src={blog.featuredImage}
                  alt={blog.title}
                />
                <h4 className="line-clamp-2 text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {blog.title}
                </h4>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            No Related Blog
          </div>
        )}
      </div>
    </div>
  )
}

export default RelatedBlog
