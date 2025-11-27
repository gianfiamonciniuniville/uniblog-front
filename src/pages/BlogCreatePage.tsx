import React, { useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import BlogForm from "../compositions/BlogForm";
import { createBlog } from "../use-cases/blog-cases";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import type { BlogCreateDto, BlogUpdateDto } from "../types/api";
import { toaster } from "../compositions/toaster"; // Import the toaster

const BlogCreatePage: React.FC = () => {
	const [disabled, setDisabled] = useState(false);
	const navigate = useNavigate();
	const { user } = useAuth();

	const handleSubmit = async (data: BlogCreateDto | BlogUpdateDto) => {
		if (!user?.id) {
			toaster.error("User not authenticated or user ID not found.");
			return;
			s;
		}
		setDisabled(true);
		try {
			const createData: BlogCreateDto = {
				title: data.title,
				description: data.description,
				userId: user.id,
			};
			await createBlog(createData);
			toaster.success("Blog created successfully!");
			navigate("/blogs");
		} catch (err: any) {
			toaster.error(err.message || "Failed to create blog.");
		} finally {
			setDisabled(false);
		}
	};

	return (
		<Box p={4}>
			<Heading as="h1" size="xl" mb={6}>
				Create New Blog
			</Heading>
			<BlogForm
				onSubmit={handleSubmit}
				disabled={disabled}
				submitButtonText="Create Blog"
			/>
		</Box>
	);
};

export default BlogCreatePage;
