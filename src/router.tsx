import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
	Outlet, // Import Outlet for nested routes
} from "react-router-dom";
import { EmptyState } from "./compositions/empty-state";
import { TbError404 } from "react-icons/tb";
import type { ReactNode } from "react";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { useAuth } from "./store/auth";
import Layout from "./compositions/layout";

import BlogListPage from "./pages/BlogListPage";
import BlogCreatePage from "./pages/BlogCreatePage";
import BlogEditPage from "./pages/BlogEditPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import PostListPage from "./pages/PostListPage";
import PostCreatePage from "./pages/PostCreatePage";
import PostEditPage from "./pages/PostEditPage";
import PostDetailPage from "./pages/PostDetailPage";
import AuthorPostListPage from "./pages/AuthorPostListPage";
import AuthorBlogListPage from "./pages/AuthorBlogListPage"; // Import AuthorBlogListPage
import UserProfilePage from "./pages/UserProfilePage";
import UserDashboardPage from "./pages/UserDashboardPage";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const { isLoggedIn } = useAuth();
	if (!isLoggedIn) {
		return <Navigate to="/login" replace />;
	}
	return children;
};

const router = createBrowserRouter([
	{
		path: "/login",
		element: (
			<Layout>
				<LoginPage />
			</Layout>
		),
	},
	{
		path: "/register",
		element: (
			<Layout>
				<RegisterPage />
			</Layout>
		),
	},
	{
		path: "/",
		element: (
			<ProtectedRoute>
				<Layout>
					<Outlet />
				</Layout>
			</ProtectedRoute>
		),
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: "home",
				element: <Navigate to="/" replace />,
			},
			{
				path: "blogs",
				element: <BlogListPage />,
			},
			{
				path: "blogs/create",
				element: <BlogCreatePage />,
			},
			{
				path: "blogs/edit/:id",
				element: <BlogEditPage />,
			},
			{
				path: "blogs/:id",
				element: <BlogDetailPage />,
			},
			{
				path: "blogs/author/:authorId", // New route for author's blogs
				element: <AuthorBlogListPage />,
			},
			{
				path: "posts",
				element: <PostListPage />,
			},
			{
				path: "posts/create",
				element: <PostCreatePage />,
			},
			{
				path: "posts/:slug/edit",
				element: <PostEditPage />,
			},
			{
				path: "posts/:slug",
				element: <PostDetailPage />,
			},
			{
				path: "posts/author/:authorId",
				element: <AuthorPostListPage />,
			},
			{
				path: "profile/:id",
				element: <UserProfilePage />,
			},
			{
				path: "dashboard",
				element: <UserDashboardPage />,
			},
		],
	},
	{
		path: "*",
		element: (
			<EmptyState
				title="Error"
				description="Não encontrou a rota"
				icon={<TbError404 />}
			/>
		),
	},
]);

export const AppRouter = () => {
	return <RouterProvider router={router} />;
};
