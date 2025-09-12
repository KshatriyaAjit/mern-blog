
export const RouteIndex = '/';
export const RouteSignin = '/signin';
export const RouteSignup = '/signup';


export const RouteProfile = '/profile';
export const RouteBlog = '/blog';
export const RouteBlogAdd = '/blog/add';
export const RouteCreateBlog = '/create-blog'; // (if you really use both, else merge with RouteBlogAdd)

export const RouteBlogEdit = (blogid) =>
  blogid ? `/blog/edit/${blogid}` : '/blog/edit/:blogid';

export const RouteBlogDetails = (category, blog) =>
  category && blog ? `/blog/${category}/${blog}` : '/blog/:category/:blog';

export const RouteBlogByCategory = (category) =>
  category ? `/blog/${category}` : '/blog/:category';

export const RouteSearch = (q) =>
  q ? `/search?q=${q}` : '/search';

export const RouteCommentDetails = '/comments';

// --------------------
// Admin Routes
// --------------------
export const RouteCategoryAdd = '/admin/add-category';
export const RouteCategoryDetails = '/categories';

export const RouteEditCategory = (categoryid) =>
  categoryid ? `/category/edit/${categoryid}` : '/category/edit/:categoryid';

export const RouteUser = '/users';
