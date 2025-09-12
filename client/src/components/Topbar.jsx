import React, { useEffect, useState } from "react";
import Light from "@/assets/images/Light.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MdLogin } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { toast } from "react-toastify";
import SearchBox from "./SearchBox";
import {
  RouteSignin,
  RouteBlogAdd,
  RouteProfile,
  RouteCategoryAdd,
} from "@/helpers/RouteName";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PlusCircle,
  LogOut,
  User as UserIcon,
  FolderPlus,
  Sun,
  Moon,
  Menu,
  X,
  Search,   // ✅ new
} from "lucide-react";
import { setTheme, initTheme } from "@/lib/theme";
import AppSidebar from "./AppSidebar";

const Topbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [theme, setThemeState] = useState("light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // ✅ toggle search in mobile

  useEffect(() => {
    initTheme();
    const stored = localStorage.getItem("theme");
    if (stored) {
      setThemeState(stored);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setThemeState(prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setThemeState(newTheme);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.info("Logged out successfully");
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 h-16 w-full 
                 z-30 bg-white dark:bg-gray-900 
                 shadow-md border-b border-gray-200 dark:border-gray-800
                 flex items-center"
      >
        <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8">
          {/* Logo + Sidebar toggle */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img
                src={Light}
                alt="Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
              <span className="hidden sm:inline font-bold text-lg text-gray-800 dark:text-gray-200">
                MyBlog
              </span>
            </Link>
          </div>

          {/* Center Search (Desktop) */}
          <div className="hidden sm:flex flex-1 justify-center max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl px-4">
            <SearchBox />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Icon */}
            <button
              className="sm:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search size={20} />
            </button>

            {/* Theme Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            {!user ? (
              <Button
                asChild
                variant="default"
                className="rounded-full px-3 sm:px-4 py-1.5"
              >
                <Link
                  to={RouteSignin}
                  className="flex items-center gap-2 text-sm sm:text-base"
                >
                  <MdLogin size={18} />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer ring-2 ring-transparent hover:ring-blue-500 transition">
                    <AvatarImage src={user.profilePic} alt={user.name} />
                    <AvatarFallback>
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 p-1 bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700"
                  align="end"
                >
                  <DropdownMenuLabel className="font-medium text-gray-700 dark:text-gray-200">
                    {user.name}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to={RouteProfile} className="flex  items-center gap-2 cursor-pointer">
                      <UserIcon size={16} />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to={RouteBlogAdd} className="flex  items-center gap-2 cursor-pointer">
                      <PlusCircle size={16} />
                      Create Blog
                    </Link>
                  </DropdownMenuItem>

                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link
                        to={RouteCategoryAdd}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <FolderPlus size={16} />
                        Add Category
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
<DropdownMenuItem
  onClick={handleLogout}
  className="flex items-center gap-2 
             text-red-600 dark:text-red-400 
             hover:!text-red-600 dark:hover:!text-red-400
             hover:!bg-red-100 dark:hover:!bg-red-900/30
             cursor-pointer transition"
>
  <LogOut size={16} />
  Logout
</DropdownMenuItem>


                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Search Bar (Dropdown) */}
      {showSearch && (
        <div className="sm:hidden fixed top-16 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2 z-20">
          <SearchBox />
        </div>
      )}

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Sidebar Panel */}
          <div className="relative w-64 bg-white dark:bg-gray-900 shadow-lg h-full z-50">
            <button
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={24} />
            </button>
            <AppSidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
