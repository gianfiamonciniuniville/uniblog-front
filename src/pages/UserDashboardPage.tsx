import React, { useEffect, useState } from "react";
import { Heading, VStack, Box, SimpleGrid, Flex } from "@chakra-ui/react";
import { useAuth } from "../store/auth";
import { getPostsByAuthor } from "../use-cases/post-cases";
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
	const [userPosts, setUserPosts] = useState<Post[]>([]);
	const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
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
				const [postsData, allBlogsData] = await Promise.all([
					getPostsByAuthor(user.id),
					getAllBlogs(),
				]);
				setUserPosts(postsData);
				setUserBlogs(allBlogsData.filter((blog) => blog.userId === user.id));
			} catch (err: any) {
				toaster.error(err.message || "Failed to load dashboard data.");
				setError("Failed to load dashboard data.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [user]);

	const handleDeletePost = (postId: number) => {
		// Implement delete functionality for posts, similar to AuthorPostListPage
		// For now, this will be handled in a later refinement or through the PostCard directly
		toaster.info(
			"Delete Post functionality not yet fully implemented on dashboard."
		);
	};

	const handleEditPost = (postId: number) => {
		// Implement edit functionality for posts
		const postToEdit = userPosts.find((p) => p.id === postId);
		if (postToEdit) {
			navigate(`/posts/edit/${postToEdit.id}`);
		}
	};

	const handleDeleteBlog = (blogId: number) => {
		// Implement delete functionality for blogs, similar to BlogListPage
		// For now, this will be handled in a later refinement or through the BlogCard directly
		toaster.info(
			"Delete Blog functionality not yet fully implemented on dashboard."
		);
	};

	const handleEditBlog = (blogId: number) => {
		// Implement edit functionality for blogs
		navigate(`/blogs/edit/${blogId}`);
	};

	if (loading) {
		return (
			<EmptyState
				title="Loading Dashboard..."
				description="Fetching your posts and blogs."
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
					Your Dashboard
				</Heading>

				<Box>
					<Flex justifyContent="space-between" alignItems="center" mb={4}>
						<Heading as="h2" size="lg">
							Your Posts
						</Heading>
						<Button variant="solid" onClick={() => navigate("/posts/create")}>
							Create New Post
						</Button>
					</Flex>
					{userPosts.length > 0 ? (
						<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
							{userPosts.map((post) => (
								<PostCard
									key={post.id}
									post={post}
									onEdit={handleEditPost}
									onDelete={handleDeletePost}
								/>
							))}
						</SimpleGrid>
					) : (
						<EmptyState
							title="No Posts"
							description="You haven't created any posts yet."
						/>
					)}
				</Box>

				<Box>
					<Flex justifyContent="space-between" alignItems="center" mb={4}>
						<Heading as="h2" size="lg">
							Your Blogs
						</Heading>
						<Button variant="solid" onClick={() => navigate("/blogs/create")}>
							Create New Blog
						</Button>
					</Flex>
					{userBlogs.length > 0 ? (
						<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
							{userBlogs.map((blog) => (
								<BlogCard
									key={blog.id}
									blog={blog}
									onEdit={handleEditBlog}
									onDelete={handleDeleteBlog}
								/>
							))}
						</SimpleGrid>
					) : (
						<EmptyState
							title="No Blogs"
							description="You haven't created any blogs yet."
						/>
					)}
				</Box>
			</VStack>
		</Box>
	);
};

export default UserDashboardPage;
