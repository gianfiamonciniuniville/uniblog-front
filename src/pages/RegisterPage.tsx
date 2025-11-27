import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../compositions/register-form";
import { useAuth } from "../store/auth";
import type { RegisterUserDto } from "../types/api"; // Added type-only import

export const RegisterPage = () => {
	const [userData, setUserData] = useState<RegisterUserDto>({ userName: "", email: "", password: "" });
    const [disabled, setDisabled] = useState(false); // Changed from isLoading to disabled
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { register } = useAuth();
	const navigate = useNavigate();

	const handleUserDataChange = (field: keyof RegisterUserDto, value: string) => {
        setUserData((prev) => ({ ...prev, [field]: value }));
        setErrorMessage(null); // Clear error message on input change
    };

	const handleSubmit = async () => {
        setDisabled(true); // Changed to setDisabled
        setErrorMessage(null);
		try {
			const response = await register(userData);
			if (response) {
				navigate("/"); // Navigate to home after successful registration and login
			}
		} catch (error: any) {
            setErrorMessage(error.message || "Registration failed. Please try again.");
		} finally {
            setDisabled(false); // Changed to setDisabled
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
