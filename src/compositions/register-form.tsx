"use client";
import { Box, Stack } from "@chakra-ui/react";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import type { FormEventHandler } from "react";
import { InputField } from "./form-elements"; // Import custom InputField
import Button from "./button"; // Import custom Button

interface RegisterFormProps {
    userName?: string;
	email?: string;
	password?: string;
    setUserName: (userName: string) => void;
	setEmail: (email: string) => void;
	setPassword: (password: string) => void;
	onSubmit: () => void;
    disabled?: boolean;
    errorMessage?: string | null;
}

export const RegisterForm = (props: RegisterFormProps) => {
	const { userName, email, password, setUserName, setEmail, setPassword, onSubmit, disabled, errorMessage } = props;

	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		onSubmit();
	};

	return (
		<Box maxW="sm" mx="auto" mt="10" p="6" borderWidth="1px" borderRadius="lg" shadow="md">
			<form onSubmit={handleSubmit}>
				<Stack gap="4">
                    {errorMessage && (
                        <Alert status="error">
                            <AlertIcon />
                            {errorMessage}
                        </Alert>
                    )}
                    <InputField
						label="Username"
						type="text"
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
                        disabled={disabled}
					/>
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
					<Button type="submit" colorScheme="blue" variant="solid" loading={disabled}>
						Register
					</Button>
				</Stack>
			</form>
		</Box>
	);
};
