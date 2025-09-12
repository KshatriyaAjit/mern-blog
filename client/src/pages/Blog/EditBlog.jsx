import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import slugify from 'slugify'
import { showToast } from '@/helpers/showToast'
import { getEvn } from '@/helpers/getEnv'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useFetch } from '@/hooks/useFetch'
import Dropzone from 'react-dropzone'
import Editor from '@/components/Editor'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { RouteBlog } from '@/helpers/RouteName'
import { decode } from 'entities'
import Loading from '@/components/Loading'

const EditBlog = () => {
    const { blogid } = useParams()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth);

    const { data: categoryData } = useFetch(`${getEvn('VITE_API_URL')}/category/all-category`, {
        method: 'get',
        credentials: 'include'
    })

    const { data: blogData, loading: blogLoading } = useFetch(`${getEvn('VITE_API_URL')}/blog/edit/${blogid}`, {
        method: 'get',
        credentials: 'include'
    }, [blogid])

    const [filePreview, setPreview] = useState()
    const [file, setFile] = useState()

    const formSchema = z.object({
        category: z.string().min(3, 'Category must be at least 3 characters long.'),
        title: z.string().min(3, 'Title must be at least 3 characters long.'),
        slug: z.string().min(3, 'Slug must be at least 3 characters long.'),
        blogContent: z.string().min(3, 'Blog content must be at least 3 characters long.'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: '',
            title: '',
            slug: '',
            blogContent: '',
        },
    })

    useEffect(() => {
        if (blogData) {
            setPreview(blogData.blog.featuredImage)
            form.setValue('category', blogData.blog.category._id)
            form.setValue('title', blogData.blog.title)
            form.setValue('slug', blogData.blog.slug)
            form.setValue('blogContent', decode(blogData.blog.blogContent))
        }
    }, [blogData])

    const handleEditorData = (_, editor) => {
        const data = editor.getData()
        form.setValue('blogContent', data)
    }

    const blogTitle = form.watch('title')

    useEffect(() => {
        if (blogTitle) {
            const slug = slugify(blogTitle, { lower: true })
            form.setValue('slug', slug)
        }
    }, [blogTitle])

    async function onSubmit(values) {
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('data', JSON.stringify(values))

            const response = await fetch(`${getEvn('VITE_API_URL')}/blog/update/${blogid}`, {
                method: 'put',
                credentials: 'include',
                body: formData
            })

            const data = await response.json()
            if (!response.ok) {
                return showToast('error', data.message)
            }

            form.reset()
            setFile()
            setPreview()
            navigate(RouteBlog)
            showToast('success', data.message)
        } catch (error) {
            showToast('error', error.message)
        }
    }

    const handleFileSelection = (files) => {
        const file = files[0]
        const preview = URL.createObjectURL(file)
        setFile(file)
        setPreview(preview)
    }

    if (blogLoading) return <Loading />

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl">
                <CardContent className="p-6">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">✏️ Edit Blog</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            
                            {/* Category */}
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Category</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categoryData?.categories?.map(category => (
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
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter blog title" {...field} className="rounded-lg" />
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
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Slug" {...field} className="rounded-lg" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Featured Image */}
                            <div>
                                <FormLabel className="text-gray-700 dark:text-gray-300">Featured Image</FormLabel>
                                <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                                    {({ getRootProps, getInputProps }) => (
                                        <div {...getRootProps()} className="mt-2 cursor-pointer">
                                            <input {...getInputProps()} />
                                            <div className="flex justify-center items-center w-40 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-violet-500 transition">
                                                {filePreview ? (
                                                    <img src={filePreview} alt="preview" className="w-full h-full object-cover rounded-lg" />
                                                ) : (
                                                    <span className="text-sm text-gray-400">Upload image</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Dropzone>
                            </div>

                            {/* Blog Content */}
                            <FormField
                                control={form.control}
                                name="blogContent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Blog Content</FormLabel>
                                        <FormControl>
                                            <div className="rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                                                <Editor props={{ initialData: field.value, onChange: handleEditorData }} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button 
                                type="submit" 
                                className="w-full py-3 rounded-lg text-lg font-semibold bg-violet-600 hover:bg-violet-700 text-white transition"
                            >
                                Update Blog
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditBlog
