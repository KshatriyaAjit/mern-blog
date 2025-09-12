import BlogCard from '@/components/BlogCard'
import Loading from '@/components/Loading'
import { getEvn } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { useParams } from 'react-router-dom'
import { BiCategory } from "react-icons/bi"

const BlogByCategory = () => {
  const { category } = useParams()
  const { data: blogData, loading, error } = useFetch(
    `${getEvn('VITE_API_URL')}/blog/get-blog-by-category/${category}`,
    {
      method: 'get',
      credentials: 'include'
    },
    [category]
  )

  if (loading) return <Loading />

  return (
    <div className="w-full">
      {/* Category Header */}
      <div className="flex items-center gap-3 text-2xl font-bold text-violet-600 dark:text-violet-400 border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
        <BiCategory className="text-3xl" />
        <h4>
          {blogData && blogData.categoryData?.name}
        </h4>
      </div>

      {/* Blog Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogData && blogData.blogs?.length > 0 ? (
          blogData.blogs.map(blog => (
            <div
              key={blog._id}
              className="transition-transform duration-300 hover:scale-105"
            >
              <BlogCard props={blog} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <BiCategory className="text-5xl text-gray-400 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No blogs found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogByCategory
