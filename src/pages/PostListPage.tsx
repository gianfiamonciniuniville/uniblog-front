/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { Post } from "../types/api"; // type-only import
import { getPostsByAuthor } from "../use-cases/post-cases"; // Changed import
import { Box, Heading, SimpleGrid, Spinner, Button } from "@chakra-ui/react"; // Box, Heading, SimpleGrid, Spinner, Button from react
import { Alert, AlertIcon } from "@chakra-ui/alert"; // Alert and AlertIcon from alert
import PostCard from "../compositions/PostCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { EmptyState } from "../compositions/empty-state"; // Added EmptyState import

const PostListPage: React.FC = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [disabled, setDisabled] = useState(true); // Changed from isLoading
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { user, isLoggedIn } = useAuth(); // Destructured user

	useEffect(() => {
		const fetchPosts = async () => {
			if (!user?.id) {
				setError("User not authenticated or user ID not available.");
				setDisabled(false);
				return;
			}
			try {
				const data = await getPostsByAuthor(user.id); // Changed function call
				setPosts(data);
			} catch (err: any) {
				setError(err.message || "Failed to fetch posts.");
			} finally {
				setDisabled(false); // Changed from setIsLoading
			}
		};
		fetchPosts();
	}, [user]); // Added user to dependency array

	if (disabled) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minH="70vh">
				<Spinner size="xl" />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert status="error">
				<AlertIcon />
				{error}
			</Alert>
		);
	}

	if (!isLoggedIn) {
		return (
			<EmptyState
				title="Access Denied"
				description="You must be logged in to view your posts."
			/>
		);
	}

	return (
		<Box p={4}>
			<Heading as="h1" size="xl" mb={6}>
				Your Posts
			</Heading>
			{isLoggedIn && (
				<Button
					colorScheme="green"
					onClick={() => navigate("/posts/create")}
					mb={6}>
					Create New Post
				</Button>
			)}
			{posts.length > 0 ? (
				<SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={6}>
					{posts.map((post) => (
						<PostCard
							key={post.id}
							post={post}
							showAuthor={true} // Optionally show author on list page
							// onEdit={isLoggedIn && currentUser?.id === post.authorId ? handleEdit : undefined}
							// onDelete={isLoggedIn && currentUser?.id === post.authorId ? handleDelete : undefined}
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
	);
};

export default PostListPage;
