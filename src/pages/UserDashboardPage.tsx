/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Heading, VStack, Box, SimpleGrid, Flex } from "@chakra-ui/react";
import { useAuth } from "../store/auth";
import { getAllPosts } from "../use-cases/post-cases"; // Changed import
import { getAllBlogs } from "../use-cases/blog-cases";
import type { Post, Blog } from "../types/api";
import { EmptyState } from "../compositions/empty-state";
import { toaster } from "../compositions/toaster";
import PostCard from "../compositions/PostCard";
import BlogCard from "../compositions/BlogCard";
import Button from "../compositions/button";
import { useNavigate } from "react-router-dom";

const UserDashboardPage: React.FC = () => {
	const { user, isLoggedIn } = useAuth();
	const navigate = useNavigate();
	const [allPosts, setAllPosts] = useState<Post[]>([]); // Changed state variable name
	const [allBlogs, setAllBlogs] = useState<Blog[]>([]); // Changed state variable name
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (!user?.id) {
				setError("User not authenticated.");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				const [postsData, blogsData] = await Promise.all([ // Changed variable name
					getAllPosts(), // Changed function call
					getAllBlogs(),
				]);
				setAllPosts(postsData); // Changed state setter
				setAllBlogs(blogsData); // Changed state setter
			} catch (err: any) {
				toaster.error(err.message || "Failed to load dashboard data.");
				setError("Failed to load dashboard data.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [user]);

	if (loading) {
		return (
			<EmptyState
				title="Loading Dashboard..."
				description="Fetching all posts and blogs." // Updated description
			/>
		);
	}

	if (error) {
		return <EmptyState title="Error Loading Dashboard" description={error} />;
	}

	if (!isLoggedIn) {
		return (
			<EmptyState
				title="Access Denied"
				description="You must be logged in to view your dashboard."
			/>
		);
	}

	return (
		<Box p={4}>
			<VStack spaceX={8} spaceY={8} align="stretch">
				<Heading as="h1" size="xl">
					Dashboard
				</Heading>

				<Box>
					<Flex justifyContent="space-between" alignItems="center" mb={4}>
						<Heading as="h2" size="lg">
							All Posts
						</Heading>
						<Button variant="solid" onClick={() => navigate("/posts/create")}>
							Create New Post
						</Button>
					</Flex>
					{allPosts.length > 0 ? ( // Changed state variable name
						<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
							{allPosts.map((post) => ( // Changed state variable name
								<PostCard
									key={post.id}
									post={post}
								/>
							))}
						</SimpleGrid>
					) : (
						<EmptyState
							title="No Posts"
							description="No posts are available." // Updated description
						/>
					)}
				</Box>

				<Box>
					<Flex justifyContent="space-between" alignItems="center" mb={4}>
						<Heading as="h2" size="lg">
							All Blogs
						</Heading>
						<Button variant="solid" onClick={() => navigate("/blogs/create")}>
							Create New Blog
						</Button>
					</Flex>
					{allBlogs.length > 0 ? ( // Changed state variable name
						<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
							{allBlogs.map((blog) => ( // Changed state variable name
								<BlogCard
									key={blog.id}
									blog={blog}
								/>
							))}
						</SimpleGrid>
					) : (
						<EmptyState
							title="No Blogs"
							description="No blogs are available." // Updated description
						/>
					)}
				</Box>
			</VStack>
		</Box>
	);
};

export default UserDashboardPage;
