"use client";
import { Box, Stack } from "@chakra-ui/react";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import type { FormEventHandler } from "react";
import { InputField } from "./form-elements"; // Import custom InputField
import Button from "./button"; // Import custom Button
import { Link } from "@chakra-ui/layout";

interface LoginFormProps {
	email?: string;
	password?: string;
	setEmail: (email: string) => void;
	setPassword: (password: string) => void;
	onSubmit: () => void;
	disabled?: boolean;
	errorMessage?: string | null;
}

export const LoginForm = (props: LoginFormProps) => {
	const {
		email,
		password,
		setEmail,
		setPassword,
		onSubmit,
		disabled,
		errorMessage,
	} = props;

	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		onSubmit();
	};

	return (
		<Box
			maxW="sm"
			mx="auto"
			mt="10"
			p="6"
			borderWidth="1px"
			borderRadius="lg"
			shadow="md">
			<form onSubmit={handleSubmit}>
				<Stack gap="4">
					{errorMessage && (
						<Alert status="error">
							<AlertIcon />
							{errorMessage}
						</Alert>
					)}
					<InputField
						label="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={disabled}
					/>
					<InputField
						label="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={disabled}
					/>
					<Link href="/register" _hover={{ textDecoration: "none" }}>
						Don't have an account? Register
					</Link>
					<Button type="submit" variant="solid" loading={disabled}>
						Login
					</Button>
				</Stack>
			</form>
		</Box>
	);
};
