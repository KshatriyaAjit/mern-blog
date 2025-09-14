import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FiEdit } from "react-icons/fi"
import { FaRegTrashAlt } from "react-icons/fa"

import { RouteCategoryAdd, RouteEditCategory } from '@/helpers/RouteName'
import { useFetch } from '@/hooks/useFetch'
import { getEvn } from '@/helpers/getEnv'
import Loading from '@/components/Loading'
import { deleteData } from '@/helpers/handleDelete'
import { showToast } from '@/helpers/showToast'

const CategoryDetails = () => {
  const [refreshData, setRefreshData] = useState(false)

  const { data: categoryData = { categories: [] }, loading, error } = useFetch(
    `${getEvn('VITE_API_URL')}/api/category/all-category`,
    { method: 'get', credentials: 'include' },
    [refreshData]
  )

  const handleDelete = async (id) => {
    const response = await deleteData(`${getEvn('VITE_API_URL')}/api/category/${id}`)
    if (response) {
      setRefreshData(!refreshData)
      showToast('success', 'Category deleted successfully.')
    } else {
      showToast('error', 'Failed to delete category.')
    }
  }

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="text-red-500 text-center mt-6 text-lg font-medium">
        ❌ Failed to load categories. Please try again later.
      </div>
    )
  }

  return (
    <div className="px-2 sm:px-4 md:px-6 py-4">
      <Card className="shadow-lg border border-gray-200 dark:border-gray-800 max-w-5xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
            📂 Categories
          </CardTitle>
          <Button
            asChild
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-md whitespace-nowrap"
          >
            <Link to={RouteCategoryAdd}>+ Add Category</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <Table>
              <TableHeader className="bg-gray-100 dark:bg-gray-800">
                <TableRow>
                  <TableHead className="text-gray-700 dark:text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Slug</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryData?.categories?.length > 0 ? (
                  categoryData.categories.map((category) => (
                    <TableRow
                      key={category._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{category.slug}</TableCell>
                      <TableCell className="flex gap-2 justify-center py-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="cursor-pointer rounded-md 
               text-violet-600 dark:text-violet-400 
               border-gray-300 dark:border-gray-700
               hover:bg-violet-600 hover:text-white 
               dark:hover:bg-violet-500 dark:hover:text-white 
               transition-all duration-200"
                          asChild
                        >
                          <Link to={RouteEditCategory(category._id)}>
                            <FiEdit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          onClick={() => handleDelete(category._id)}
                          variant="outline"
                          size="icon"
                          className="cursor-pointer rounded-md 
               text-red-600 dark:text-red-400 
               border-gray-300 dark:border-gray-700
               hover:bg-red-600 hover:text-white 
               dark:hover:bg-red-500 dark:hover:text-white 
               transition-all duration-200"
                        >
                          <FaRegTrashAlt className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="3" className="text-center py-6 text-gray-500 dark:text-gray-400">
                      No categories found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoryDetails
