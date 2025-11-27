/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/AuthorPostListPage.tsx
import React, { useEffect, useState, useMemo } from "react"; // Added useMemo
import { useParams, useNavigate } from "react-router-dom";
import type { Post, UserDto } from "../types/api";
import { getPostsByAuthor, deletePost } from "../use-cases/post-cases";
import { getUserById } from "../use-cases/user-cases";
import { Box, Heading, SimpleGrid, RadioGroup, HStack } from "@chakra-ui/react"; // Added RadioGroup, Stack, Radio
import PostCard from "../compositions/PostCard";
import { useAuth } from "../store/auth";
import { toaster } from "../compositions/toaster"; // Import the toaster
import { EmptyState } from "../compositions/empty-state"; // Import EmptyState

const AuthorPostListPage: React.FC = () => {
	const { authorId } = useParams<{ authorId: string }>();
	const parsedAuthorId = Number(authorId);
	const [allPosts, setAllPosts] = useState<Post[]>([]); // Renamed to allPosts
	const [author, setAuthor] = useState<UserDto | null>(null);
	const [disabled, setDisabled] = useState(true);
	const [filterStatus, setFilterStatus] = useState<
		"all" | "published" | "unpublished"
	>("all"); // New state for filter
	const navigate = useNavigate();
	const { user: currentUser, isLoggedIn } = useAuth();

	const handlePostStatusChange = (postId: number, isPublished: boolean) => {
		setAllPosts((prevPosts) =>
			prevPosts.map((post) =>
				post.id === postId ? { ...post, isPublished } : post
			)
		);
	};

	useEffect(() => {
		const fetchAuthorAndPosts = async () => {
			if (isNaN(parsedAuthorId)) {
				toaster.error({ title: { title: "Invalid Author ID." } });
				setDisabled(false);
				return;
			}
			try {
				const [postsData, authorData] = await Promise.all([
					getPostsByAuthor(parsedAuthorId), // Removed isPublishedFilter
					getUserById(parsedAuthorId),
				]);
				setAllPosts(postsData); // Set allPosts
				setAuthor(authorData);
			} catch (err: any) {
				toaster.error({
					title: err.message || "Failed to fetch author's posts.",
				});
			} finally {
				setDisabled(false);
			}
		};
		fetchAuthorAndPosts();
	}, [parsedAuthorId]); // Removed filterStatus from dependency array

	const filteredPosts = useMemo(() => {
		if (filterStatus === "all") {
			return allPosts;
		} else if (filterStatus === "published") {
			return allPosts.filter((post) => post.published);
		} else {
			return allPosts.filter((post) => !post.published);
		}
	}, [allPosts, filterStatus]);

	const handleDeletePost = async (postIdToDelete: number) => {
		if (!isLoggedIn || currentUser?.id !== parsedAuthorId) {
			toaster.error({ title: "You are not authorized to delete this post." });
			return;
		}

		if (window.confirm("Are you sure you want to delete this post?")) {
			try {
				await deletePost(postIdToDelete);
				toaster.success({ title: "Post deleted successfully!" });
				setAllPosts(allPosts.filter((post) => post.id !== postIdToDelete)); // Filter from allPosts
			} catch (err: any) {
				toaster.error({ title: err.message || "Failed to delete post." });
			}
		}
	};

	const handleEditPost = (postIdToEdit: number) => {
		if (!isLoggedIn || currentUser?.id !== parsedAuthorId) {
			toaster.error({ title: "You are not authorized to edit this post." });
			return;
		}
		const postToEdit = allPosts.find((p) => p.id === postIdToEdit); // Find from allPosts
		if (postToEdit) {
			navigate(`/posts/edit/${postToEdit.id}`);
		}
	};

	if (disabled) {
		return (
			<EmptyState
				title="Loading Posts..."
				description="Please wait while we fetch the author's posts."
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
				Posts by {author.userName}
			</Heading>
			<RadioGroup.Root
				value={filterStatus}
				onValueChange={(e) => setFilterStatus(e.value as any)}>
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

			{filteredPosts.length > 0 ? (
				<SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={6}>
					{filteredPosts.map((post) => (
						<PostCard
							key={post.id}
							post={post}
							showAuthor={false}
							onPostStatusChange={handlePostStatusChange} // Added prop
							onEdit={
								isLoggedIn && currentUser?.id === parsedAuthorId
									? handleEditPost
									: undefined
							}
							onDelete={
								isLoggedIn && currentUser?.id === parsedAuthorId
									? handleDeletePost
									: undefined
							}
						/>
					))}
				</SimpleGrid>
			) : (
				<EmptyState
					title="No Posts"
					description={`No posts found for ${author.userName}.`}
				/>
			)}
		</Box>
	);
};

export default AuthorPostListPage;
