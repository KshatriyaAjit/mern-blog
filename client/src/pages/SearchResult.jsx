import BlogCard from '@/components/BlogCard'
import { getEvn } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import Loading from '@/components/Loading'

const SearchResult = () => {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q')
  const { data: blogData, loading, error } = useFetch(`${getEvn('VITE_API_URL')}/blog/search?q=${q}`, {
    method: 'get',
    credentials: 'include'
  })

  if (loading) return <Loading />

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-6">
      {/* Search Header */}
      <div className="flex items-center gap-3 text-xl md:text-2xl font-bold text-violet-600 dark:text-violet-400 border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
        <h4>🔍 Search Results for: <span className="italic text-gray-800 dark:text-gray-200">"{q}"</span></h4>
      </div>

      {/* Blog Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-8">
        {blogData && blogData.blogs.length > 0 ? (
          blogData.blogs.map(blog => <BlogCard key={blog._id} props={blog} />)
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-16 px-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
              No results found for <span className="text-violet-600 dark:text-violet-400">"{q}"</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Try searching with different keywords.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResult
