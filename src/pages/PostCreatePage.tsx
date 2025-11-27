/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import PostForm from "../compositions/PostForm";
import { createPost } from "../use-cases/post-cases";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import type { PostCreateDto, PostUpdateDto } from "../types/api";
import { toaster } from "../compositions/toaster"; // Import the toaster

const PostCreatePage: React.FC = () => {
	const [disabled, setDisabled] = useState(false);
	const navigate = useNavigate();
	const { user } = useAuth();

	const handleSubmit = async (data: PostCreateDto | PostUpdateDto) => {
		if (!user?.id) {
			toaster.error({ title: "User not authenticated or user ID not found." });
			return;
		}

		if (
			!("blogId" in data) ||
			typeof data.blogId !== "number" ||
			data.blogId === 0
		) {
			toaster.error({ title: "Please select a blog for the post." });
			return;
		}

		setDisabled(true);
		try {
			const createData: PostCreateDto = {
				title: data.title,
				content: data.content,
				slug: data.slug,
				authorId: user.id,
				blogId: data.blogId,
			};
			await createPost(createData);
			toaster.success({ title: "Post created successfully!" });
			navigate("/posts");
		} catch (err: any) {
			toaster.error(err.message || "Failed to create post.");
		} finally {
			setDisabled(false);
		}
	};

	return (
		<Box p={4}>
			<Heading as="h1" size="xl" mb={6}>
				Create New Post
			</Heading>
			<PostForm
				onSubmit={handleSubmit}
				disabled={disabled}
				submitButtonText="Create Post"
			/>
		</Box>
	);
};

export default PostCreatePage;
