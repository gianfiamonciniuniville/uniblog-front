/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../compositions/register-form";
import { useAuth } from "../store/auth";
import type { RegisterUserDto } from "../types/api"; // Added type-only import

export const RegisterPage = () => {
	const [userData, setUserData] = useState<RegisterUserDto>({
		userName: "",
		email: "",
		password: "",
	});
	const [disabled, setDisabled] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { register } = useAuth();
	const navigate = useNavigate();

	const handleUserDataChange = (
		field: keyof RegisterUserDto,
		value: string
	) => {
		setUserData((prev) => ({ ...prev, [field]: value }));
		setErrorMessage(null);
	};

	const handleSubmit = async () => {
		setDisabled(true);
		setErrorMessage(null);
		try {
			const response = await register(userData);
			if (response) {
				navigate("/");
			}
		} catch (error: any) {
			setErrorMessage(
				error.message || "Registration failed. Please try again."
			);
		} finally {
			setDisabled(false);
		}
	};

	return (
		<RegisterForm
			userName={userData.userName || ""}
			email={userData.email || ""}
			password={userData.password || ""}
			setUserName={(name) => handleUserDataChange("userName", name)}
			setEmail={(email) => handleUserDataChange("email", email)}
			setPassword={(password) => handleUserDataChange("password", password)}
			onSubmit={handleSubmit}
			disabled={disabled} // Changed from isLoading to disabled
			errorMessage={errorMessage}
		/>
	);
};
