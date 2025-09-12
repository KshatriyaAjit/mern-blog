import React from "react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/helpers/firebase";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { useNavigate } from "react-router-dom"; // ✅ import navigate

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ add this

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const res = await api.post("/auth/google-login", { idToken: token });

      toast.success(res.data.message || "Google login successful 🎉");

      // update redux
      dispatch(
        loginSuccess({
          user: res.data.user,
          token: res.data.token,
        })
      );

      navigate("/"); // ✅ redirect after login success
    } catch (error) {
      console.error(error);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="mt-4 w-full max-w-sm mx-auto">
      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          or continue with
        </span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
      </div>

      {/* Google Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleLogin}
        className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                   shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700
                   transition-all duration-200 cursor-pointer"
      >
        <FcGoogle className="text-2xl" />
        <span className="font-medium text-sm sm:text-base">
          Continue with Google
        </span>
      </Button>
    </div>
  );
};

export default GoogleLogin;
