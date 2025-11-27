import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
    Outlet // Import Outlet for nested routes
} from "react-router-dom";
import { EmptyState } from "./compositions/empty-state";
import { TbError404 } from "react-icons/tb";
import type { ReactNode } from "react";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { useAuth } from "./store/auth";
import Layout from "./compositions/layout"; // Import the Layout component

// Import new pages (will be created in subsequent steps)
import BlogListPage from "./pages/BlogListPage";
import BlogCreatePage from "./pages/BlogCreatePage";
import BlogEditPage from "./pages/BlogEditPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import PostListPage from "./pages/PostListPage";
import PostCreatePage from "./pages/PostCreatePage";
import PostEditPage from "./pages/PostEditPage";
import PostDetailPage from "./pages/PostDetailPage";
import AuthorPostListPage from "./pages/AuthorPostListPage";
import UserProfilePage from "./pages/UserProfilePage";
import UserDashboardPage from "./pages/UserDashboardPage"; // Import the new UserDashboardPage


const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const { isLoggedIn } = useAuth();
	if (!isLoggedIn) {
		return <Navigate to="/login" replace />; // Use replace to prevent going back to login
	}
	return children;
};

const router = createBrowserRouter([
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},
    {
        path: "/",
        element: <ProtectedRoute><Layout><Outlet /></Layout></ProtectedRoute>, // Layout wraps protected routes
        children: [
            {
                index: true, // This will be the default route for "/"
                element: <HomePage />,
            },
            {
                path: "home", // Redirect /home to /
                element: <Navigate to="/" replace />,
            },
            // Blog Routes
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
            // Post Routes
            {
                path: "posts",
                element: <PostListPage />,
            },
            {
                path: "posts/create",
                element: <PostCreatePage />,
            },
            {
                path: "posts/edit/:id",
                element: <PostEditPage />,
            },
            {
                path: "posts/:slug", // Using slug for detail view
                element: <PostDetailPage />,
            },
            {
                path: "posts/author/:authorId",
                element: <AuthorPostListPage />,
            },
            // User Profile Route
            {
                path: "profile/:id",
                element: <UserProfilePage />,
            },
            // User Dashboard Route
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