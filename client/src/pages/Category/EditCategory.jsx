import React, { useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import slugify from 'slugify';
import { showToast } from '@/helpers/showToast';
import { useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import api from '@/utils/api';

const EditCategory = () => {
    const { categoryid } = useParams();

    // ✅ Fetch existing category data
    const { data: categoryData, loading, error } = useFetch(`/api/category/single/${categoryid}`, {
        method: 'get',
    }, [categoryid]);

    // ✅ Zod validation schema
    const formSchema = z.object({
        name: z.string().min(3, 'Name must be at least 3 characters long.'),
        slug: z.string().min(3, 'Slug must be at least 3 characters long.'),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            slug: '',
        },
    });

    const categoryName = form.watch('name');

    // ✅ Auto-generate slug when name changes
    useEffect(() => {
        if (categoryName) {
            const slug = slugify(categoryName, { lower: true });
            form.setValue('slug', slug);
        }
    }, [categoryName, form]);

    // ✅ Populate form with existing data
    useEffect(() => {
        if (categoryData?.category) {
            form.setValue('name', categoryData.category.name);
            form.setValue('slug', categoryData.category.slug);
        }
    }, [categoryData, form]);

    // ✅ Submit handler
    async function onSubmit(values) {
        try {
            const { data } = await api.put(`/category/${categoryid}`, values); // ✅ Axios instance
            showToast('success', data.message || 'Category updated successfully!');
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            showToast('error', message);
        }
    }

    if (error) {
        return (
            <div className="text-center text-red-500 mt-6">
                Failed to load category. Please try again later.
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <Card className="w-full max-w-lg shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
                <CardHeader className="pb-2 text-center">
                    <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Edit Category
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                                className="rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:text-gray-100 transition"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-sm text-red-500" />
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
                                                placeholder="Slug"
                                                {...field}
                                                className="rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:text-gray-100 transition"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-sm text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full rounded-lg py-2 font-medium bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white transition"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Category'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditCategory;
