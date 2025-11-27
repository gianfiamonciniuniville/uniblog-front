/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import type { Post, CommentCreateDto } from "../types/api";
import { getPostBySlug } from "../use-cases/post-cases";
import { createComment, deleteComment } from "../use-cases/comment-cases";
import {
	Box,
	Heading,
	Text,
	Spinner,
	Link as ChakraLink,
	VStack,
} from "@chakra-ui/react";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import CommentList from "../compositions/CommentList";
import CommentForm from "../compositions/CommentForm";
import LikeButton from "../compositions/LikeButton";
import { useAuth } from "../store/auth";
import { toaster } from "../compositions/toaster"; // Import the toaster
import { EmptyState } from "../compositions/empty-state"; // Import EmptyState

const PostDetailPage: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const [post, setPost] = useState<Post | null>(null);
	const [disabled, setDisabled] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [commentLoading, setCommentLoading] = useState(false);
	const [commentError, setCommentError] = useState<string | null>(null);
	const { user, isLoggedIn } = useAuth();

	const fetchPost = async () => {
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
	};

	useEffect(() => {
		fetchPost();
	}, [slug]);

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
			await fetchPost(); // Re-fetch post to get updated comments
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
			await fetchPost(); // Re-fetch post to get updated comments
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

	return (
		<Box p={4}>
			<VStack align="start" gap={4}>
				<Heading as="h1" size="xl">
					{post.title}
				</Heading>
				<Text fontSize="md" color="gray.500">
					By{" "}
					<ChakraLink
						as={RouterLink}
						href={`/profile/${post.authorId}`}
						color="blue.500">
						{post.authorId}
					</ChakraLink>{" "}
					in{" "}
					<ChakraLink
						as={RouterLink}
						href={`/blogs/${post.blogId}`}
						color="blue.500">
						{post.blogId}
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
