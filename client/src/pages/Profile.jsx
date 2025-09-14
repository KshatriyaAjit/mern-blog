import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, setUser } from "@/redux/authSlice";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import api from "@/utils/api";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/auth/me");
        dispatch(setUser(data.user));
        setName(data.user.name);
        setEmail(data.user.email);
        setAvatar(data.user.avatar);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchProfile();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      dispatch(logout());
      toast.info("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (file) {
        formData.append("avatar", file);
      }

      const { data } = await api.put("/api/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(setUser(data.user));
      toast.success("Profile updated successfully!");
      setAvatar(data.user.avatar);
      setEditMode(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleChangePassword = async () => {
    try {
      const currentPassword = document.getElementById("currentPass").value;
      const newPassword = document.getElementById("newPass").value;

      await api.put("/api/auth/update-password", { currentPassword, newPassword });

      toast.success("Password changed successfully!");
      setPasswordMode(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4 px-4">
      {/* Title with gradient */}
      <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        User Profile
      </h1>

      <Card
        className="w-full max-w-lg shadow-xl border rounded-3xl 
        bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
        transition-all duration-300 hover:shadow-2xl hover:border-violet-600/50 dark:hover:border-violet-500/40 
  hover:shadow-[0_0_12px_rgba(139,92,246,0.25)] dark:hover:shadow-[0_0_12px_rgba(139,92,246,0.35)]"
      >
        <CardContent className="flex flex-col items-center p-8">
          {/* Avatar */}
          <div className="relative group">
            <Avatar className="w-32 h-32 mb-6 border-4 border-blue-500 shadow-lg transition-transform transform group-hover:scale-105">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-xl font-bold">
                {name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Content */}
          {editMode ? (
            <>
              <div className="w-full mb-4">
                <Label className="text-gray-700 dark:text-gray-300">
                  Upload Avatar
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setAvatar(URL.createObjectURL(e.target.files[0]));
                  }}
                  className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
              <div className="w-full mb-4">
                <Label className="text-gray-700 dark:text-gray-300">Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
              <div className="w-full mb-4">
                <Label className="text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
              <div className="flex gap-3 mt-6 flex-wrap">
                <Button
                  className="bg-green-600 text-white cursor-pointer 
         hover:bg-green-700 hover:shadow-md transition-all duration-300"
                  onClick={handleSaveChanges}
                >
                  💾 Save
                </Button>
                <Button
                  variant="destructive"
                  className="cursor-pointer hover:opacity-90 hover:shadow-md transition-all duration-300"
                  onClick={() => setEditMode(false)}
                >
                  ❌ Cancel
                </Button>
              </div>
            </>
          ) : passwordMode ? (
            <>
              <div className="w-full mb-4">
                <Label className="text-gray-700 dark:text-gray-300">
                  Current Password
                </Label>
                <Input
                  type="password"
                  id="currentPass"
                  className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
              <div className="w-full mb-4">
                <Label className="text-gray-700 dark:text-gray-300">
                  New Password
                </Label>
                <Input
                  type="password"
                  id="newPass"
                  className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
              <div className="flex gap-3 mt-6 flex-wrap">
                <Button
                  className="bg-gray-500 text-white cursor-pointer 
  hover:bg-gray-600 hover:shadow-md transition-all duration-300"
                  onClick={handleChangePassword}
                >
                  🔑 Change
                </Button>
                <Button
                  variant="destructive"
                  className="cursor-pointer hover:opacity-90 hover:shadow-md transition-all duration-300"
                  onClick={() => setPasswordMode(false)}
                >
                  ❌ Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-full text-left mb-6 space-y-3 text-gray-700 dark:text-gray-300">
                <p className="text-lg truncate max-w-full">
                  <strong>Email:</strong> {email}
                </p>
                <p className="text-lg">
                  <strong>Name:</strong> {name}
                </p>
                <p className="text-lg">
                  <strong>Role:</strong>{" "}
                  <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-sm">
                    {user?.role || "user"}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                <Button
                  className="bg-purple-600 text-white cursor-pointer 
  hover:bg-purple-700 hover:shadow-md transition-all duration-300"
                  onClick={() => setEditMode(true)}
                >
                  ✏️ Edit
                </Button>
                <Button
                  variant="secondary"
                  className="bg-gray-700 text-white cursor-pointer 
  hover:bg-gray-600 hover:shadow-md transition-all duration-300"
                  onClick={() => setPasswordMode(true)}
                >
                  🔑 Change Password
                </Button>

                <Button
                  variant="destructive"
                  className="flex items-center gap-2 cursor-pointer 
  hover:bg-red-700 hover:shadow-md transition-all duration-300"
                  onClick={handleLogout}
                >
                  <LogOut size={18} /> Logout
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
