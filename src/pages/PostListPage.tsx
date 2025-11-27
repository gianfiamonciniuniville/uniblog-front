/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from "react"; // Added useMemo
import type { Post } from "../types/api"; // type-only import
import { getPostsByAuthor } from "../use-cases/post-cases"; // Changed import
import {
	Box,
	Heading,
	SimpleGrid,
	Spinner,
	Button,
	RadioGroup,
	HStack,
} from "@chakra-ui/react"; // Added RadioGroup, Stack, Radio
import { Alert, AlertIcon } from "@chakra-ui/alert"; // Alert and AlertIcon from alert
import PostCard from "../compositions/PostCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { EmptyState } from "../compositions/empty-state"; // Added EmptyState import

const PostListPage: React.FC = () => {
	const [allPosts, setAllPosts] = useState<Post[]>([]); // Renamed to allPosts
	const [disabled, setDisabled] = useState(true); // Changed from isLoading
	const [error, setError] = useState<string | null>(null);
	const [filterStatus, setFilterStatus] = useState<
		"all" | "published" | "unpublished"
	>("all"); // New state for filter
	const navigate = useNavigate();
	const { user, isLoggedIn } = useAuth(); // Destructured user

	const handlePostStatusChange = (postId: number, isPublished: boolean) => {
		setAllPosts((prevPosts) =>
			prevPosts.map((post) =>
				post.id === postId ? { ...post, isPublished } : post
			)
		);
	};

	useEffect(() => {
		const fetchPosts = async () => {
			if (!user?.id) {
				setError("User not authenticated or user ID not available.");
				setDisabled(false);
				return;
			}
			try {
				const data = await getPostsByAuthor(user.id); // Removed isPublishedFilter
				setAllPosts(data); // Set allPosts
			} catch (err: any) {
				setError(err.message || "Failed to fetch posts.");
			} finally {
				setDisabled(false); // Changed from setIsLoading
			}
		};
		fetchPosts();
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

			{filteredPosts.length > 0 ? ( // Use filteredPosts
				<SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={6}>
					{filteredPosts.map(
						(
							post // Use filteredPosts
						) => (
							<PostCard
								key={post.id}
								post={post}
								showAuthor={true} // Optionally show author on list page
								onPostStatusChange={handlePostStatusChange} // Added prop
								// onEdit={isLoggedIn && currentUser?.id === post.authorId ? handleEdit : undefined}
								// onDelete={isLoggedIn && currentUser?.id === post.authorId ? handleDelete : undefined}
							/>
						)
					)}
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
