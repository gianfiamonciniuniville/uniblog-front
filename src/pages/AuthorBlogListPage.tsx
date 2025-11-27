// src/pages/AuthorBlogListPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Blog, UserDto } from "../types/api";
import { getBlogsByAuthor, deleteBlog } from "../use-cases/blog-cases";
import { getUserById } from "../use-cases/user-cases";
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import BlogCard from "../compositions/BlogCard";
import { useAuth } from "../store/auth";
import { toaster } from "../compositions/toaster";
import { EmptyState } from "../compositions/empty-state";

const AuthorBlogListPage: React.FC = () => {
	const { authorId } = useParams<{ authorId: string }>();
	const parsedAuthorId = Number(authorId);
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [author, setAuthor] = useState<UserDto | null>(null);
	const [disabled, setDisabled] = useState(true);
	const navigate = useNavigate();
	const { user: currentUser, isLoggedIn } = useAuth();

	useEffect(() => {
		const fetchAuthorAndBlogs = async () => {
			if (isNaN(parsedAuthorId)) {
				toaster.error({ title: "Invalid Author ID." });
				setDisabled(false);
				return;
			}
			try {
				const [blogsData, authorData] = await Promise.all([
					getBlogsByAuthor(parsedAuthorId),
					getUserById(parsedAuthorId),
				]);
				setBlogs(blogsData);
				setAuthor(authorData);
			} catch (err: unknown) {
				toaster.error({
					title: (err as Error).message || "Failed to fetch author's blogs.",
				});
			} finally {
				setDisabled(false);
			}
		};
		fetchAuthorAndBlogs();
	}, [parsedAuthorId]);

	const handleDeleteBlog = async (blogIdToDelete: number) => {
		if (!isLoggedIn || currentUser?.id !== parsedAuthorId) {
			toaster.error({ title: "You are not authorized to delete this blog." });
			return;
		}

		if (window.confirm("Are you sure you want to delete this blog?")) {
			try {
				await deleteBlog(blogIdToDelete);
				toaster.success({ title: "Blog deleted successfully!" });
				setBlogs(blogs.filter((blog) => blog.id !== blogIdToDelete));
			} catch (err: unknown) {
				toaster.error({
					title: (err as Error).message || "Failed to delete blog.",
				});
			}
		}
	};

	const handleEditBlog = (blogIdToEdit: number) => {
		if (!isLoggedIn || currentUser?.id !== parsedAuthorId) {
			toaster.error({ title: "You are not authorized to edit this blog." });
			return;
		}
		navigate(`/blogs/edit/${blogIdToEdit}`);
	};

	if (disabled) {
		return (
			<EmptyState
				title="Loading Blogs..."
				description="Please wait while we fetch the author's blogs."
			/>
		);
	}

	if (!author) {
		return (
			<EmptyState
				title="Author Not Found"
				description="The author you are looking for does not exist."
			/>
		);
	}

	return (
		<Box p={4}>
			<Heading as="h1" size="xl" mb={6}>
				Blogs by {author.userName}
			</Heading>
			{blogs.length > 0 ? (
				<SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={6}>
					{blogs.map((blog) => (
						<BlogCard
							key={blog.id}
							blog={blog}
							showAuthor={false}
							onEdit={
								isLoggedIn && currentUser?.id === parsedAuthorId
									? handleEditBlog
									: undefined
							}
							onDelete={
								isLoggedIn && currentUser?.id === parsedAuthorId
									? handleDeleteBlog
									: undefined
							}
						/>
					))}
				</SimpleGrid>
			) : (
				<EmptyState
					title="No Blogs"
					description={`No blogs found for ${author.userName}.`}
				/>
			)}
		</Box>
	);
};

export default AuthorBlogListPage;
