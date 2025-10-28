import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { useAuthStore } from "./store/auth";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	const { isLoggedIn } = useAuthStore();
	if (!isLoggedIn) {
		return <Navigate to="/login" />;
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
		path: "/dashboard",
		element: (
			<ProtectedRoute>
				<DashboardPage />
			</ProtectedRoute>
		),
	},
	{
		path: "*",
		element: <Navigate to="/login" />,
	},
]);

export const AppRouter = () => {
	return <RouterProvider router={router} />;
};