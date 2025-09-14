import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useState } from 'react'
import { useFetch } from '@/hooks/useFetch'
import { getEvn } from '@/helpers/getEnv'
import Loading from '@/components/Loading'
import { FaRegTrashAlt } from "react-icons/fa"
import { deleteData } from '@/helpers/handleDelete'
import { showToast } from '@/helpers/showToast'

const Comments = () => {
    const [refreshData, setRefreshData] = useState(false)
    const { data, loading, error } = useFetch(`${getEvn('VITE_API_URL')}/api/comment`, {
        method: 'get',
        credentials: 'include'
    }, [refreshData])

    const handleDelete = async (id) => {
        const response = await deleteData(`${getEvn('VITE_API_URL')}/api/comment/${id}`)
        if (response) {
            setRefreshData(!refreshData)
            showToast('success', 'Comment deleted successfully.')
        } else {
            showToast('error', 'Failed to delete comment.')
        }
    }

    if (loading) return <Loading />

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <Card className="shadow-md rounded-2xl border border-gray-200 dark:border-gray-700 transition-all">
                <CardHeader>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Comments
                    </h2>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-sm md:text-base">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                                    <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">Blog</th>
                                    <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">Commented By</th>
                                    <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">Comment</th>
                                    <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.comments.length > 0 ? (
                                    data.comments.map((comment) => (
                                        <tr
                                            key={comment._id}
                                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                                                {comment?.blogid?.title}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                                {comment?.user?.name}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                                {comment?.comment}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Button
                                                    onClick={() => handleDelete(comment._id)}
                                                    variant="outline"
                                                    className="p-2 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600 text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all"
                                                >
                                                    <FaRegTrashAlt size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-6 text-gray-500 dark:text-gray-400"
                                        >
                                            No comments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Comments
