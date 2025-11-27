// src/compositions/CommentForm.tsx
import React, { useState } from "react";
import { Box, Stack, Heading } from "@chakra-ui/react";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import { TextareaField } from "./form-elements"; // Import custom TextareaField
import Button from "./button"; // Import custom Button

interface CommentFormProps {
	onSubmit: (content: string) => Promise<void>;
	isLoading?: boolean;
	errorMessage?: string | null;
}

const CommentForm: React.FC<CommentFormProps> = ({
	onSubmit,
	isLoading,
	errorMessage,
}) => {
	const [content, setContent] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim()) {
			return;
		}
		await onSubmit(content);
		setContent("");
	};

	return (
		<Box
			mt={8}
			p={5}
			shadow="md"
			borderWidth="1px"
			borderRadius="lg"
			width="100%">
			<Heading size="md" mb={4}>
				Add a Comment
			</Heading>
			<form onSubmit={handleSubmit}>
				<Stack gap={4}>
					{errorMessage && (
						<Alert status="error">
							<AlertIcon />
							{errorMessage}
						</Alert>
					)}
					<TextareaField
						label="Your Comment"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Write your comment here..."
						disabled={isLoading}
						rows={4}
						error={
							errorMessage
								? { message: errorMessage, type: "manual" }
								: undefined
						}
					/>
					<Button
						type="submit"
						variant="solid"
						colorScheme="blue"
						loading={isLoading}
						disabled={!content.trim()}>
						Submit Comment
					</Button>
				</Stack>
			</form>
		</Box>
	);
};

export default CommentForm;
