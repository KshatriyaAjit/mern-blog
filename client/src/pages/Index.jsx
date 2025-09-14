import BlogCard from '@/components/BlogCard'
import Loading from '@/components/Loading'
import { getEvn } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'

const Index = () => {
    const { data: blogData, loading, error } = useFetch(`${getEvn('VITE_API_URL')}/api/blog/blogs`, {
        method: 'get',
        credentials: 'include'
    })
   
    if (loading) return <Loading />

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {blogData && blogData.blogs.length > 0 ? (
                <div className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {blogData.blogs.map(blog => (
                        <BlogCard key={blog._id} props={blog} />
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center py-10">
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                        🚫 No blogs found.
                    </p>
                </div>
            )}
        </div>
    )
}

export default Index