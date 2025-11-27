/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import type { Post, CommentCreateDto } from "../types/api";
import { getPostBySlug, deletePost } from "../use-cases/post-cases";
import { createComment, deleteComment } from "../use-cases/comment-cases";
import {
	Box,
	Heading,
	Text,
	Spinner,
	Link as ChakraLink,
	VStack,
	Button,
	HStack,
} from "@chakra-ui/react";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import CommentList from "../compositions/CommentList";
import CommentForm from "../compositions/CommentForm";
import LikeButton from "../compositions/LikeButton";
import { useAuth } from "../store/auth";
import { toaster } from "../compositions/toaster"; // Import the toaster
import { EmptyState } from "../compositions/empty-state"; // Import EmptyState
import { useNavigate } from "react-router-dom";

const PostDetailPage: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const [post, setPost] = useState<Post | null>(null);
	const [disabled, setDisabled] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [commentLoading, setCommentLoading] = useState(false);
	const [commentError, setCommentError] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const { user, isLoggedIn } = useAuth();
	const navigate = useNavigate();

	const handleDeletePost = async () => {
		if (
			!window.confirm(
				"Are you sure you want to delete this post? This action cannot be undone."
			)
		) {
			return;
		}
		setIsDeleting(true);
		try {
			if (post?.id) {
				await deletePost(post.id);
				toaster.success({ title: "Post deleted successfully!" });
				navigate(`/profile/${user?.id}/posts`); // Redirect to author's post list
			}
		} catch (err: any) {
			toaster.error({ title: err.message || "Failed to delete post." });
		} finally {
			setIsDeleting(false);
		}
	};

	const fetchPost = useCallback(async () => {
		if (!slug) {
			setError("Post slug is missing.");
			setDisabled(false);
			return;
		}
		try {
			const data = await getPostBySlug(slug);
			setPost(data);
		} catch (err: any) {
			setError(err.message || "Failed to fetch post details.");
		} finally {
			setDisabled(false);
		}
	}, [slug]); // Add slug as a dependency for useCallback

	useEffect(() => {
		fetchPost();
	}, [fetchPost]); // Now fetchPost is a stable dependency

	const handleCommentSubmit = async (content: string) => {
		if (!user?.id || !post?.id) {
			toaster.error({ title: "You must be logged in to comment." });
			return;
		}
		setCommentLoading(true);
		setCommentError(null);
		try {
			const newCommentData: CommentCreateDto = {
				content,
				postId: post.id,
				userId: user.id,
			};
			await createComment(newCommentData);
			toaster.success({ title: "Comment added successfully!" });
			await fetchPost();
		} catch (err: any) {
			toaster.error(err.message || "Failed to add comment.");
			setCommentError(err.message || "Failed to add comment.");
		} finally {
			setCommentLoading(false);
		}
	};

	const handleDeleteComment = async (commentId: number) => {
		if (!user?.id || !post?.id) {
			toaster.error({ title: "You must be logged in to delete comments." });
			return;
		}
		if (!window.confirm("Are you sure you want to delete this comment?")) {
			return;
		}

		try {
			await deleteComment(commentId);
			toaster.success({ title: "Comment deleted successfully!" });
			await fetchPost();
		} catch (err: any) {
			toaster.error(err.message || "Failed to delete comment.");
		}
	};

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

	if (!post) {
		return (
			<EmptyState
				title="Post Not Found"
				description="The post you are looking for does not exist."
			/>
		);
	}

	const userHasLiked =
		post.likes?.some((like) => like.user.id === user?.id) || false;
	const findLikeOfUser = post.likes?.find((like) => like.user.id === user?.id);
	const isAuthor = user && post.author.id === user.id;

	return (
		<Box p={4} w="100%" mx="auto">
			<VStack align="start" gap={4} w="100%" alignItems={"center"}>
				<HStack justifyContent="space-between" w="100%">
					<Heading as="h1" size="xl">
						{post.title}
					</Heading>
					{isAuthor && (
						<HStack>
							<Button
								colorScheme="blue"
								onClick={() => navigate(`/posts/${post.slug}/edit`)}>
								Edit
							</Button>
							<Button
								colorScheme="red"
								onClick={handleDeletePost}
								loading={isDeleting}>
								Delete
							</Button>
						</HStack>
					)}
				</HStack>
				<Text fontSize="md" color="gray.500">
					By{" "}
					<ChakraLink href={`/profile/${post.author.id}`} color="blue.500">
						{post.author.userName}
					</ChakraLink>{" "}
					in{" "}
					<ChakraLink href={`/blogs/${post.blog.id}`} color="blue.500">
						{post.blog.title}
					</ChakraLink>
				</Text>
				<Text
					fontSize="lg"
					dangerouslySetInnerHTML={{ __html: post.content }}
				/>

				<Box display="flex" alignItems="center" mt={4}>
					<LikeButton
						postId={post.id}
						initialLikesCount={post.likes?.length || 0}
						userHasLikedInitial={userHasLiked}
						post={post}
						findLikeOfUser={findLikeOfUser}
						fetchPost={fetchPost}
					/>
				</Box>

				<CommentList
					comments={post.comments || []}
					onDeleteComment={handleDeleteComment}
				/>
				{isLoggedIn ? (
					<CommentForm
						onSubmit={handleCommentSubmit}
						isLoading={commentLoading}
						errorMessage={commentError}
					/>
				) : (
					<Alert status="info" mt={8}>
						<AlertIcon />
						<Text>
							Please{" "}
							<ChakraLink as={RouterLink} href="/login" color="blue.500">
								log in
							</ChakraLink>{" "}
							to leave a comment.
						</Text>
					</Alert>
				)}
			</VStack>
		</Box>
	);
};

export default PostDetailPage;
