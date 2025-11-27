/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import { Select } from "@chakra-ui/select";
import type { PostCreateDto, PostUpdateDto, Post, Blog } from "../types/api";
import { getAllBlogs } from "../use-cases/blog-cases";
import { InputField, TextareaField } from "./form-elements"; // Import custom InputField and TextareaField
import Button from "./button"; // Import custom Button
import { FormControl, FormLabel } from "@chakra-ui/form-control";

interface PostFormProps {
	initialData?: Post; // For editing existing posts
	onSubmit: (data: PostCreateDto | PostUpdateDto) => Promise<void>;
	disabled?: boolean;
	errorMessage?: string | null;
	submitButtonText?: string;
}

const PostForm: React.FC<PostFormProps> = ({
	initialData,
	onSubmit,
	disabled,
	errorMessage,
	submitButtonText = "Submit",
}) => {
	const [title, setTitle] = useState(initialData?.title || "");
	const [content, setContent] = useState(initialData?.content || "");
	const [slug, setSlug] = useState(initialData?.slug || "");
	const [blogId, setBlogId] = useState<number | undefined>(
		initialData?.blog.id
	);
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [fetchingBlogs, setFetchingBlogs] = useState(true);
	const [blogFetchError, setBlogFetchError] = useState<string | null>(null);

	useEffect(() => {
		if (initialData) {
			setTitle(initialData.title);
			setContent(initialData.content);
			setSlug(initialData.slug);
			setBlogId(initialData.blog.id);
		}
	}, [initialData]);

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const data = await getAllBlogs();
				setBlogs(data);
				if (!initialData && data.length > 0 && !blogId) {
					setBlogId(data[0].id);
				}
			} catch (err: any) {
				setBlogFetchError("Failed to load blogs for selection.");
				console.error(err);
			} finally {
				setFetchingBlogs(false);
			}
		};
		fetchBlogs();
	}, [initialData, blogId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!blogId && !initialData) {
			setBlogFetchError("Please select a blog.");
			return;
		}

		if (initialData) {
			await onSubmit({ title, content, slug });
		} else {
			await onSubmit({
				title,
				content,
				slug,
				authorId: 0,
				blogId: blogId as number,
			});
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
					<InputField
						label="Title"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						disabled={disabled}
						required
					/>
					<InputField
						label="Slug"
						type="text"
						value={slug}
						onChange={(e) => setSlug(e.target.value)}
						disabled={disabled}
						required
					/>
					<TextareaField
						label="Content"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						disabled={disabled}
						rows={10}
						required
					/>
					<FormControl id="blogId" isRequired>
						<FormLabel>Select Blog</FormLabel>
						<Select
							placeholder={fetchingBlogs ? "Loading blogs..." : "Select a blog"}
							value={blogId || ""}
							onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
								setBlogId(Number(e.target.value))
							}
							disabled={disabled || fetchingBlogs} // initialData is not a reason to disable select
						>
							{blogFetchError && (
								<option value="" disabled>
									{blogFetchError}
								</option>
							)}
							{blogs.map((blog) => (
								<option key={blog.id} value={blog.id}>
									{blog.title}
								</option>
							))}
						</Select>
						{blogFetchError && (
							<Alert status="error" mt={2}>
								<AlertIcon />
								{blogFetchError}
							</Alert>
						)}
					</FormControl>
					<Button type="submit" variant="solid" loading={disabled}>
						{submitButtonText}
					</Button>
				</Stack>
			</form>
		</Box>
	);
};

export default PostForm;
