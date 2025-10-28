import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import { EmptyState } from "./compositions/empty-state";
import { TbError404 } from "react-icons/tb";
import type { ReactNode } from "react";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePAge";
import { useAuth } from "./store/auth";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const { isLoggedIn } = useAuth();
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
		path: "/home",
		element: (
			<ProtectedRoute>
				<HomePage />
			</ProtectedRoute>
		),
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
