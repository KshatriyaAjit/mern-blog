import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RouteBlogAdd, RouteBlogEdit } from "@/helpers/RouteName";
import { useFetch } from "@/hooks/useFetch";
import { getEvn } from "@/helpers/getEnv";
import { deleteData } from "@/helpers/handleDelete";
import { showToast } from "@/helpers/showToast";
import Loading from "@/components/Loading";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import {  PlusCircle } from "lucide-react";
import { IoHomeOutline } from "react-icons/io5";
import moment from "moment";

const BlogDetails = () => {
  const [refreshData, setRefreshData] = useState(false);
  const { data: blogData, loading } = useFetch(
    `${getEvn("VITE_API_URL")}/api/blog/get-all`,
    {
      method: "get",
      credentials: "include",
    },
    [refreshData]
  );

  const handleDelete = async (id) => {
    const response = await deleteData(`${getEvn("VITE_API_URL")}/api/blog/delete/${id}`);
    if (response) {
      setRefreshData(!refreshData);
      showToast("success", "Blog deleted successfully.");
    } else {
      showToast("error", "Failed to delete blog.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="w-full">
      <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        {/* Header with actions */}
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Blog Management
          </h2>
          <div className="flex gap-3">
            <Button variant="outline" asChild className="rounded-lg">
              
              <Link to="/">
               <IoHomeOutline className="text-lg" />
              Home</Link>
            </Button>
            <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg">
                                 <Link to={RouteBlogAdd} className="flex items-center gap-2">
                                   <PlusCircle size={16} />
                                   Create Blog
                                 </Link>
            </Button>
          </div>
        </CardHeader>

        {/* Table */}
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-800">
                  <TableHead className="text-gray-700 dark:text-gray-300">Author</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Title</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Slug</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Dated</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {blogData && blogData.blogs.length > 0 ? (
                  blogData.blogs.map((blog) => (
                    <TableRow
                      key={blog._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <TableCell className="font-medium">{blog?.author?.name}</TableCell>
                      <TableCell>{blog?.category?.name}</TableCell>
                      <TableCell className="truncate max-w-[200px]">{blog?.title}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{blog?.slug}</TableCell>
                      <TableCell>
                        {moment(blog?.createdAt).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell className="flex gap-3">
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full hover:bg-violet-600 hover:text-white dark:hover:bg-violet-500 dark:hover:text-white transition"
                          asChild
                        >
                          <Link to={RouteBlogEdit(blog._id)}>
                            <FiEdit />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDelete(blog._id)}
                          className="rounded-full cursor-pointer hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition"
                        >
                          <FaRegTrashAlt />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">
                      No blogs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetails;
