import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/utils/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RouteSignin } from "@/helpers/RouteName";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleLogin from "@/components/GoogleLogin";

const SignUp = () => {
  const [loading, setLoading] = useState(false);

  // ✅ Form validation schema
  const formSchema = z
    .object({
      name: z.string().min(3, "Name must be at least 3 characters long"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters long"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // ✅ Handle form submit
  async function onSubmit(values) {
    try {
      setLoading(true);
      const res = await api.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (res.status === 201) {
        toast.success(res.data.message || "Registration successful! Please login.");
        navigate(RouteSignin);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const message =
        error.response?.data?.message || "Registration failed. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full 
      bg-gradient-to-br from-gray-50 to-gray-200 
      dark:from-gray-900 dark:to-gray-800 px-3 sm:px-4 py-4 sm:py-8 transition-colors">
      
<Card className="w-full max-w-md p-4 sm:p-8 
  rounded-2xl shadow-2xl border border-gray-200 
  dark:border-gray-700 dark:bg-gray-900 bg-white transition-all duration-300">

  <h1 className="text-xl sm:text-3xl font-bold text-center mb-3 sm:mb-6 
    text-gray-800 dark:text-gray-100">
    Create Your Account
  </h1>

  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-5">
      {/* Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 dark:text-gray-300 text-sm">Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter your full name"
                className="mt-1 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-700 
             bg-white/90 dark:bg-gray-800/80 
             focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 
             focus:border-violet-500 dark:focus:border-violet-400 
             focus:shadow-lg focus:shadow-violet-500/30 dark:focus:shadow-violet-400/20 
             transition-all duration-300"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 dark:text-gray-300 text-sm">Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="mt-1 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-700 
             bg-white/90 dark:bg-gray-800/80 
             focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 
             focus:border-violet-500 dark:focus:border-violet-400 
             focus:shadow-lg focus:shadow-violet-500/30 dark:focus:shadow-violet-400/20 
             transition-all duration-300"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Password */}
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 dark:text-gray-300 text-sm">Password</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="Enter your password"
                className="mt-1 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-700 
             bg-white/90 dark:bg-gray-800/80 
             focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 
             focus:border-violet-500 dark:focus:border-violet-400 
             focus:shadow-lg focus:shadow-violet-500/30 dark:focus:shadow-violet-400/20 
             transition-all duration-300"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Confirm Password */}
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 dark:text-gray-300 text-sm">Confirm Password</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="Enter password again"
                className="mt-1 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-700 
             bg-white/90 dark:bg-gray-800/80 
             focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 
             focus:border-violet-500 dark:focus:border-violet-400 
             focus:shadow-lg focus:shadow-violet-500/30 dark:focus:shadow-violet-400/20 
             transition-all duration-300"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Submit */}
      <Button 
        type="submit" 
        className="w-full py-2 mt-5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold
          bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all cursor-pointer"
        disabled={loading}
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </Button>
    </form>
  </Form>

  {/* Google Login */}
  <div className="mt-1 sm:mt-5">
    <GoogleLogin />
  </div>

  {/* Link */}
  <div className="mt-4 sm:mt-6 text-xs sm:text-sm flex justify-center items-center gap-1 sm:gap-2">
    <p className="text-gray-600 dark:text-gray-400">Already have an account?</p>
    <Link 
      to={RouteSignin} 
      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-all"
    >
      Sign In
    </Link>
  </div>
</Card>

    </div>
  );
};

export default SignUp;
