import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import slugify from "slugify";
import { showToast } from "@/helpers/showToast";
import { getEvn } from "@/helpers/getEnv";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import Dropzone from "react-dropzone";
import Editor from "@/components/Editor";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RouteBlog } from "@/helpers/RouteName";
import api from "@/utils/api";

const AddBlog = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const {
    data: categoryData = { categories: [] },
  } = useFetch(`${getEvn("VITE_API_URL")}/category/all-category`, {
    method: "get",
    credentials: "include",
  });

  const [filePreview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  // Validation schema
  const formSchema = z.object({
    category: z.string().min(3, "Category must be at least 3 characters long."),
    title: z.string().min(3, "Title must be at least 3 characters long."),
    slug: z.string().min(3, "Slug must be at least 3 characters long."),
    blogContent: z
      .string()
      .min(3, "Blog content must be at least 3 characters long."),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
    },
  });

  // CKEditor handler
  const handleEditorData = (event, editor) => {
    const data = editor.getData();
    form.setValue("blogContent", data);
  };

  // Auto slugify
  const blogTitle = form.watch("title");
  useEffect(() => {
    if (blogTitle) {
      const slug = slugify(blogTitle, { lower: true });
      form.setValue("slug", slug);
    }
  }, [blogTitle]);

  // Submit handler
  async function onSubmit(values) {
    try {
      if (!file) {
        return showToast("error", "Featured image is required.");
      }

      const newValues = { ...values, author: user?._id };
      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(newValues));

      const { data } = await api.post(`/blog/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      form.reset();
      setFile(null);
      setPreview(null);
      navigate(RouteBlog);
      showToast("success", data.message);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      showToast("error", errMsg);
    }
  }

  // Handle file
  const handleFileSelection = (files) => {
    const selectedFile = files[0];
    const preview = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreview(preview);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
        <CardContent className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Add Blog
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Category
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-violet-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryData?.categories?.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter blog title"
                        {...field}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-violet-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Slug
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Slug"
                        {...field}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-violet-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Featured Image */}
              <div>
                <FormLabel className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Featured Image
                </FormLabel>
                <Dropzone onDrop={handleFileSelection}>
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps()}
                      className="cursor-pointer flex justify-center items-center w-40 h-32 sm:w-48 sm:h-36 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-violet-500 dark:hover:border-violet-400 transition"
                    >
                      <input {...getInputProps()} />
                      {filePreview ? (
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Upload Image
                        </span>
                      )}
                    </div>
                  )}
                </Dropzone>
              </div>

              {/* Blog Content */}
              <FormField
                control={form.control}
                name="blogContent"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Blog Content
                    </FormLabel>
                    <FormControl>
                      <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
                      <Editor
                        props={{
                          initialData: "",
                          onChange: handleEditorData,
                        }}
                      />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white font-medium px-6 py-2 rounded-lg transition"
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlog;
