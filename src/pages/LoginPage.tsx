import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../compositions/login-form";
import { useAuth } from "../store/auth";
import type { LoginUserDto } from "../types/api"; // Added type-only import

export const LoginPage = () => {
	const [credentials, setCredentials] = useState<LoginUserDto>({ email: "", password: "" });
    const [disabled, setDisabled] = useState(false); // Changed from isLoading to disabled
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleCredentialChange = (field: keyof LoginUserDto, value: string) => {
        setCredentials((prev) => ({ ...prev, [field]: value }));
        setErrorMessage(null); // Clear error message on input change
    };

	const handleSubmit = async () => {
        setDisabled(true); // Changed to setDisabled
        setErrorMessage(null);
		try {
			const response = await login(credentials);
			if (response) {
				navigate("/"); // Navigate to home after successful login
			}
		} catch (error: any) {
            setErrorMessage(error.message || "Login failed. Please check your credentials.");
		} finally {
            setDisabled(false); // Changed to setDisabled
        }
	};

	return (
		<LoginForm
			email={credentials.email || ""}
			password={credentials.password || ""}
			setEmail={(email) => handleCredentialChange("email", email)}
			setPassword={(password) => handleCredentialChange("password", password)}
			onSubmit={handleSubmit}
            disabled={disabled} // Changed from isLoading to disabled
            errorMessage={errorMessage}
		/>
	);
};
