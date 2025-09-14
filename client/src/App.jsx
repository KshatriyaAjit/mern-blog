import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import AuthRouteProtection from "./components/AuthRouteProtection";
import OnlyAdminAllowed from "./components/OnlyAdminAllowed";

import {
  RouteIndex,
  RouteSignin,
  RouteSignup,
  RouteProfile,
  RouteBlogAdd,
  RouteCategoryAdd,
  RouteCategoryDetails,
  RouteBlog,
  RouteEditCategory,
  RouteCommentDetails,
  RouteUser,
  RouteSearch,
  RouteBlogDetails,
  RouteBlogByCategory,
  RouteBlogEdit,
} from "./helpers/RouteName";

import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import AddBlog from "./pages/Blog/AddBlog";
import AddCategory from "./pages/Category/AddCategory";
import CategoryDetails from "./pages/Category/CategoryDetails";
import EditCategory from "./pages/Category/EditCategory";
import BlogDetails from "./pages/Blog/BlogDetails";
import SingleBlogDetails from "./pages/SingleBlogDetails";
import BlogByCategory from "./pages/Blog/BlogByCategory";
import Comments from "./pages/Comments";
import User from "./pages/User";
import SearchResult from "./pages/SearchResult";
import EditBlog from "./pages/Blog/EditBlog";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            {/* Routes with Layout (Topbar + Sidebar + Footer) */}
            <Route path={RouteIndex} element={<Layout />}>
              {/* Public Page */}
              <Route index element={<Index />} />

              {/* Authenticated User Pages */}
              <Route element={<AuthRouteProtection />}>
                <Route path={RouteProfile} element={<Profile />} />
                <Route path={RouteBlogAdd} element={<AddBlog />} />
                <Route path={RouteBlog} element={<BlogDetails />} />
                <Route path={RouteCommentDetails} element={<Comments />} />
                <Route path={RouteBlogEdit()} element={<EditBlog />} />
              </Route>

              {/* Admin Only Pages */}
              <Route element={<OnlyAdminAllowed />}>
                <Route path={RouteCategoryDetails} element={<CategoryDetails />} />
                <Route path={RouteEditCategory()} element={<EditCategory />} />
                <Route path={RouteCategoryAdd} element={<AddCategory />} />
                <Route path={RouteUser} element={<User />} />
              </Route>

            <Route path={RouteBlogDetails()} element={<SingleBlogDetails />} />
            <Route path={RouteBlogByCategory()} element={<BlogByCategory />} />
             <Route path={RouteSearch()} element={<SearchResult />} />

             </Route>

            {/* Routes WITHOUT Layout */}

           
            <Route path={RouteSignin} element={<SignIn />} />
            <Route path={RouteSignup} element={<SignUp />} />

          
          </Routes>

          {/* Toast Notifications */}
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
