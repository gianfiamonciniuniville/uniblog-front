/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/BlogListPage.tsx
import React, { useEffect, useState } from "react";
import type { Blog } from "../types/api";
import { getAllBlogs, deleteBlog } from "../use-cases/blog-cases";
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import BlogCard from "../compositions/BlogCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toaster } from "../compositions/toaster"; // Import the toaster
import { EmptyState } from "../compositions/empty-state"; // Import EmptyState
import Button from "../compositions/button"; // Import custom Button

const BlogListPage: React.FC = () => {
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [disabled, setDisabled] = useState(true);
	const navigate = useNavigate();
	const { user, isLoggedIn } = useAuth();

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const data = await getAllBlogs();
				setBlogs(data);
			} catch (err: any) {
				toaster.error({ title: err.message || "Failed to fetch blogs." });
			} finally {
				setDisabled(false);
			}
		};
		fetchBlogs();
	}, []);

	const handleEdit = (id: number) => {
		navigate(`/blogs/edit/${id}`);
	};

	const handleDelete = async (id: number) => {
		if (
			!isLoggedIn ||
			user?.id !== blogs.find((blog) => blog.id === id)?.userId
		) {
			toaster.error({ title: "You are not authorized to delete this blog." });
			return;
		}

		if (window.confirm("Are you sure you want to delete this blog?")) {
			try {
				await deleteBlog(id);
				toaster.success({ title: "Blog deleted successfully!" });
				setBlogs(blogs.filter((blog) => blog.id !== id));
			} catch (err: any) {
				toaster.error({ title: err.message || "Failed to delete blog." });
			}
		}
	};

	if (disabled) {
		return (
			<EmptyState
				title="Loading Blogs..."
				description="Please wait while we fetch the blogs."
			/>
		);
	}

	if (blogs.length === 0) {
		return (
			<EmptyState
				title="No Blogs Found"
				description="There are no blogs available yet.">
				{isLoggedIn && (
					<Button
						variant="solid"
						onClick={() => navigate("/blogs/create")}
						mt={4}>
						Create New Blog
					</Button>
				)}
			</EmptyState>
		);
	}

	return (
		<Box p={4}>
			<Heading as="h1" size="xl" mb={6}>
				All Blogs
			</Heading>
			{isLoggedIn && (
				<Button
					variant="solid"
					onClick={() => navigate("/blogs/create")}
					mb={6}>
					Create New Blog
				</Button>
			)}
			<SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={6}>
				{blogs.map((blog) => (
					<BlogCard
						key={blog.id}
						blog={blog}
						onEdit={
							isLoggedIn && user?.id === blog.userId ? handleEdit : undefined
						}
						onDelete={
							isLoggedIn && user?.id === blog.userId ? handleDelete : undefined
						}
					/>
				))}
			</SimpleGrid>
		</Box>
	);
};

export default BlogListPage;
