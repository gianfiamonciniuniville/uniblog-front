"use client";
import { Box, Button, Input, Stack } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import type { FormEventHandler } from "react";

interface LoginFormProps {
	email?: string;
	password?: string;
	setEmail: (email: string) => void;
	setPassword: (password: string) => void;
	onSubmit: () => void;
}

export const LoginForm = (props: LoginFormProps) => {
	const { email, password, setEmail, setPassword, onSubmit } = props;

	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		onSubmit();
	};

	return (
		<Box maxW="sm" mx="auto" mt="10">
			<form onSubmit={handleSubmit}>
				<Stack gap="4">
					<FormControl>
						<FormLabel>Email</FormLabel>
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Password</FormLabel>
						<Input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</FormControl>
					<Button type="submit" colorScheme="blue">
						Login
					</Button>
				</Stack>
			</form>
		</Box>
	);
};