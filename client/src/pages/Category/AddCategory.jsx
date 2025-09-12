import React, { useEffect } from 'react'
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
import api from '@/utils/api'

const AddCategory = () => {

    const formSchema = z.object({
        name: z.string().min(3, 'Name must be at least 3 characters long.'),
        slug: z.string().min(3, 'Slug must be at least 3 characters long.'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            slug: '',
        },
    })

    const categoryName = form.watch('name')

    useEffect(() => {
        if (categoryName) {
            const slug = slugify(categoryName, { lower: true })
            form.setValue('slug', slug)
        }
    }, [categoryName])

    async function onSubmit(values) {
        try {
            const response = await api.post('/category', values)
            showToast('success', response.data.message)
            form.reset()
        } catch (error) {
            if (error.response) {
                showToast('error', error.response.data.message || "Something went wrong")
            } else {
                showToast('error', error.message)
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 
                        bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Card className="w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-700 
                             bg-white dark:bg-gray-800 rounded-2xl">
                <CardContent className="p-6 sm:p-8">
                    <h1 className="text-2xl font-bold text-center mb-6 
                                   text-gray-900 dark:text-gray-100">
                        Add New Category
                    </h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            {/* Name Field */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter category name"
                                                {...field}
                                                className="w-full rounded-lg border-gray-300 
                                                           dark:border-gray-600 
                                                           dark:bg-gray-700 dark:text-white 
                                                           focus:ring-2 focus:ring-indigo-500 
                                                           focus:border-indigo-500 transition"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-sm mt-1" />
                                    </FormItem>
                                )}
                            />

                            {/* Slug Field */}
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Slug</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Auto-generated slug"
                                                {...field}
                                                className="w-full rounded-lg border-gray-300 
                                                           dark:border-gray-600 
                                                           dark:bg-gray-700 dark:text-white 
                                                           focus:ring-2 focus:ring-indigo-500 
                                                           focus:border-indigo-500 transition"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-sm mt-1" />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full mt-4 py-2 rounded-lg text-white font-medium 
                                           bg-indigo-600 hover:bg-indigo-700 
                                           dark:bg-indigo-500 dark:hover:bg-indigo-600 
                                           transition duration-200 shadow-md"
                            >
                                Submit
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddCategory
