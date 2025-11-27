/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from "react"; // Added useMemo
import {
	Heading,
	VStack,
	Box,
	SimpleGrid,
	Flex,
	RadioGroup,
	HStack,
} from "@chakra-ui/react"; // Added RadioGroup, Stack, Radio
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
	const [filterStatus, setFilterStatus] = useState<
		"all" | "published" | "unpublished"
	>("all"); // New state for filter

	const handlePostStatusChange = (postId: number, isPublished: boolean) => {
		setAllPosts((prevPosts) =>
			prevPosts.map((post) =>
				post.id === postId ? { ...post, isPublished } : post
			)
		);
	};

	useEffect(() => {
		const fetchData = async () => {
			if (!user?.id) {
				setError("User not authenticated.");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				const [postsData, blogsData] = await Promise.all([
					getAllPosts(),
					getAllBlogs(),
				]);
				setAllPosts(postsData);
				setAllBlogs(blogsData);
			} catch (err: any) {
				toaster.error(err.message || "Failed to load dashboard data.");
				setError("Failed to load dashboard data.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [user]); // Removed filterStatus from dependency array

	const filteredPosts = useMemo(() => {
		if (filterStatus === "all") {
			return allPosts;
		} else if (filterStatus === "published") {
			return allPosts.filter((post) => post.published);
		} else {
			return allPosts.filter((post) => !post.published);
		}
	}, [allPosts, filterStatus]);

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

					<RadioGroup.Root
						value={filterStatus}
						onValueChange={(e) => setFilterStatus(e.value as any)}
						marginBottom={4}>
						<HStack gap={6}>
							{[
								{ value: "all", label: "All" },
								{ value: "published", label: "Published" },
								{ value: "unpublished", label: "Unpublished" },
							].map((item) => (
								<RadioGroup.Item key={item.value} value={item.value}>
									<RadioGroup.ItemHiddenInput />
									<RadioGroup.ItemIndicator />
									<RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
								</RadioGroup.Item>
							))}
						</HStack>
					</RadioGroup.Root>

					{filteredPosts.length > 0 ? ( // Changed state variable name
						<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
							{filteredPosts.map(
								(
									post // Changed state variable name
								) => (
									<PostCard
										key={post.id}
										post={post}
										onPostStatusChange={handlePostStatusChange} // Added prop
									/>
								)
							)}
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
							{allBlogs.map(
								(
									blog // Changed state variable name
								) => (
									<BlogCard key={blog.id} blog={blog} />
								)
							)}
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
