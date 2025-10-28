import { useState } from "react";
import type { ILoginUserDto } from "../types/analystics";
import { loginUser } from "../use-cases/user-cases";

export const useAuth = () => {
	const [token, setToken] = useState<string | null>(null);

	const saveToken = (token: string | null) => {
		if (token) {
			localStorage.setItem("token", token);
		} else {
			localStorage.removeItem("token");
		}

		return token;
	};

	const logout = () => {
		setToken(null);
		saveToken(null);
	};

	const login = async (data: ILoginUserDto) => {
		const response = await loginUser(data);
		if (!response) {
			setToken(null);
			saveToken(null);
			return;
		}

		setToken(response?.token);
		saveToken(response.token);

		return response;
	};

	return {
		token,
		setToken,
		logout,
		login,
		isLoggedIn: !!token,
	};
};
