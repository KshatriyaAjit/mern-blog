import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RouteSignup } from "@/helpers/RouteName";
import { Link, useNavigate } from "react-router-dom";
import api from "@/utils/api"; // Axios instance
import { toast } from "react-toastify";
import GoogleLogin from "@/components/GoogleLogin";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/authSlice";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Zod validation schema
  const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ✅ Submit Handler
  async function onSubmit(values) {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", values);

      if (res.status === 200) {
        toast.success(res.data.message || "Login successful 🎉");
        dispatch(
          loginSuccess({
            user: res.data.user,
            token: res.data.token,
          })
        );
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-br from-violet-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-3 sm:px-4 py-4 sm:py-8">
      <Card className="w-full max-w-md p-4 sm:p-8 shadow-2xl rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-6 text-gray-800 dark:text-gray-100">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
          Login into your account to continue
        </p>

        {/* ✅ Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email address"
                      type="email"
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

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    Password
                  </FormLabel>
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 transition-all cursor-pointer"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>

        {/* ✅ Google Login Component */}
        <div className="mt-5 sm:mt-6">
          <GoogleLogin />
        </div>

        {/* Signup Link */}
        <div className="mt-5 sm:mt-6 text-xs sm:text-sm flex justify-center items-center gap-2">
          <p className="text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?
          </p>
          <Link
            to={RouteSignup}
            className="text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300 font-semibold transition-all"
          >
            Sign Up
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
