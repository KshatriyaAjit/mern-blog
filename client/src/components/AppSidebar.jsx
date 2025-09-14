import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { GrBlog } from "react-icons/gr";
import { FaRegComments } from "react-icons/fa6";
import { LuUsers } from "react-icons/lu";
import { GoDot } from "react-icons/go";
import {
  RouteBlog,
  RouteBlogByCategory,
  RouteCategoryDetails,
  RouteCommentDetails,
  RouteIndex,
  RouteUser,
} from "@/helpers/RouteName";
import { useFetch } from "@/hooks/useFetch";
import { getEvn } from "@/helpers/getEnv";
import { useSelector } from "react-redux";

const AppSidebar = ({ onClose }) => {
  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = !!token;

  const { data: categoryData } = useFetch(
    `${getEvn("VITE_API_URL")}/api/category/all-category`,
    {
      method: "get",
      credentials: "include",
    }
  );

  return (
    <SidebarContent className="h-screen flex flex-col  px-3 pt-4 pb-14 space-y-6 overflow-hidden">
      {/* Main Menu (Fixed) */}
      <SidebarGroup className="flex-shrink-0">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <IoHomeOutline className="text-lg" />
              <Link to={RouteIndex} className="font-medium">
                Home
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {isLoggedIn && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <GrBlog className="text-lg" />
                  <Link to={RouteBlog} className="font-medium">
                    Blogs
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <FaRegComments className="text-lg" />
                  <Link to={RouteCommentDetails} className="font-medium">
                    Comments
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          {isLoggedIn && user?.role === "admin" && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <BiCategoryAlt className="text-lg" />
                  <Link to={RouteCategoryDetails} className="font-medium">
                    Categories
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <LuUsers className="text-lg" />
                  <Link to={RouteUser} className="font-medium">
                    Users
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarGroup>

      {/* Categories Section (Scrollable) */}
      <SidebarGroup className=" flex-1 min-h-0 overflow-y-auto">
        <SidebarGroupLabel className="text-gray-500 dark:text-gray-400 px-4 mb-2 uppercase tracking-wide text-xs font-semibold">
          Categories
        </SidebarGroupLabel>
        <SidebarMenu className="space-y-1">
          {categoryData &&
            categoryData.categories?.length > 0 &&
            categoryData.categories.map((category) => (
              <SidebarMenuItem key={category._id}>
                <SidebarMenuButton
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <GoDot className="text-sm" />
                  <Link
                    to={RouteBlogByCategory(category.slug)}
                    className="font-medium"
                  >
                    {category.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default AppSidebar;
