import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../compositions/login-form";
import { useAuth } from "../store/auth";

export const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async () => {
		const response = await login({ email, password });
		if (response) {
			navigate("/");
		}
	};

	return (
		<LoginForm
			email={email}
			password={password}
			setEmail={setEmail}
			setPassword={setPassword}
			onSubmit={handleSubmit}
		/>
	);
};
