// src/compositions/BlogForm.tsx
import React, { useState, useEffect } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import type { Blog, BlogCreateDto, BlogUpdateDto } from "../types/api";
import { InputField, TextareaField } from "./form-elements";
import Button from "./button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";

interface BlogFormProps {
	initialData?: Blog; // For editing existing blogs
	onSubmit: (data: BlogCreateDto | BlogUpdateDto) => Promise<void>;
	disabled?: boolean;
	errorMessage?: string | null;
	submitButtonText?: string;
	authorId?: number;
}

const BlogForm: React.FC<BlogFormProps> = ({
	initialData,
	onSubmit,
	disabled,
	errorMessage,
	submitButtonText = "Submit",
	authorId,
}) => {
	const [title, setTitle] = useState(initialData?.title || "");
	const [description, setDescription] = useState(
		initialData?.description || ""
	);

	useEffect(() => {
		if (initialData) {
			setTitle(initialData.title);
			setDescription(initialData.description);
		}
	}, [initialData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (initialData) {
			// Update existing blog
			await onSubmit({ title, description });
		} else {
			// Create new blog
			if (authorId === undefined) {
				// This should ideally be caught by the parent component
				console.error("Author ID is missing for new blog creation.");
				return;
			}
			await onSubmit({ title, description, userId: authorId });
		}
	};

	return (
		<Box
			maxW="lg"
			mx="auto"
			mt="10"
			p={5}
			shadow="md"
			borderWidth="1px"
			borderRadius="lg">
			<form onSubmit={handleSubmit}>
				<Stack gap={4}>
					{errorMessage && (
						<Alert status="error">
							<AlertIcon />
							{errorMessage}
						</Alert>
					)}
					<FormControl isRequired>
						<FormLabel>Title</FormLabel>
						<InputField
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							disabled={disabled}
						/>
					</FormControl>
					<FormControl isRequired>
						<FormLabel>Description</FormLabel>
						<TextareaField
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							disabled={disabled}
							rows={5}
						/>
					</FormControl>
					<Button type="submit" variant="solid" loading={disabled}>
						{submitButtonText}
					</Button>
				</Stack>
			</form>
		</Box>
	);
};

export default BlogForm;
