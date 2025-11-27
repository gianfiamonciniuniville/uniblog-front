import { useState, useEffect } from "react";
import type { LoginUserDto, UserDto, RegisterUserDto } from "../types/api"; // Removed AuthResponseDto, Added RegisterUserDto
import { loginUser, registerUser as registerUserService } from "../use-cases/user-cases"; // Renamed to avoid conflict

export const useAuth = () => {
	const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
	const [user, setUser] = useState<UserDto | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

	const saveAuthData = (tokenData: string | null, userData: UserDto | null) => {
		if (tokenData) {
			localStorage.setItem("token", tokenData);
		} else {
			localStorage.removeItem("token");
		}

        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            localStorage.removeItem("user");
        }
		setToken(tokenData);
        setUser(userData);
	};

    useEffect(() => {
        // This effect runs once on mount to ensure state is synced with localStorage
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

	const logout = () => {
		saveAuthData(null, null);
	};

	const login = async (credentials: LoginUserDto) => {
		try {
			const response = await loginUser(credentials);
			if (response) {
				saveAuthData(response.token, response.user);
			}
			return response;
		} catch (error: any) {
			console.error("Login failed:", error);
			logout(); // Clear any partial auth data on login failure
			throw error; // Re-throw to be handled by the UI
		}
	};

    const register = async (userData: RegisterUserDto) => {
        try {
            const response = await registerUserService(userData);
            if (response) {
                saveAuthData(response.token, response.user);
            }
            return response;
        } catch (error: any) {
            console.error("Registration failed:", error);
            logout(); // Clear any partial auth data on registration failure
            throw error; // Re-throw to be handled by the UI
        }
    }

    const updateUser = (updatedFields: Partial<UserDto>) => {
        if (user) {
            const updatedUser = { ...user, ...updatedFields };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }
    };

	return {
		token,
        user,
		logout,
		login,
        register,
        updateUser, // Expose updateUser function
		isLoggedIn: !!token,
	};
};
