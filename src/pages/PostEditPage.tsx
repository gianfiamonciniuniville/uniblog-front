/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import PostForm from "../compositions/PostForm";
import { getPostById, updatePost } from "../use-cases/post-cases";
import { useNavigate, useParams } from "react-router-dom";
import type { PostUpdateDto, Post } from "../types/api";
import { useAuth } from "../store/auth";
import { toaster } from "../compositions/toaster"; // Import the toaster
import { EmptyState } from "../compositions/empty-state"; // Import EmptyState

const PostEditPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const postId = Number(id);
	const [initialData, setInitialData] = useState<Post | null>(null);
	const [disabled, setDisabled] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const { user } = useAuth();

	useEffect(() => {
		const fetchPost = async () => {
			if (isNaN(postId)) {
				toaster.error({ title: "Invalid Post ID." });
				setDisabled(false);
				return;
			}
			try {
				const data = await getPostById(postId);

				if (user && data.author.id === user.id) {
					setInitialData(data);
				} else {
					toaster.error({ title: "You are not authorized to edit this post." });
					navigate("/");
				}
			} catch (err: any) {
				toaster.error({
					title: err.message || "Failed to load post for editing.",
				});
			} finally {
				setDisabled(false);
			}
		};
		fetchPost();
	}, [postId, user, navigate]);

	const handleSubmit = async (data: PostUpdateDto) => {
		setIsSubmitting(true);
		try {
			if (!initialData?.id) {
				toaster.error({ title: "Post ID not found for update." });
				setIsSubmitting(false);
				return;
			}
			await updatePost(initialData.id, data);
			toaster.success({ title: "Post updated successfully!" });
			navigate(`/posts/${data.slug || initialData.slug}`);
		} catch (err: any) {
			toaster.error({ title: err.message || "Failed to update post." });
		} finally {
			setIsSubmitting(false);
		}
	};

	if (disabled) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minH="70vh">
				<EmptyState
					title="Loading Post..."
					description="Please wait while we fetch the post details."
				/>
			</Box>
		);
	}

	if (!initialData) {
		return (
			<EmptyState
				title="Post Not Found or Unauthorized"
				description="The post you are looking for does not exist or you do not have permission to edit it."
			/>
		);
	}

	return (
		<Box p={4}>
			<Heading as="h1" size="xl" mb={6}>
				Edit Post
			</Heading>
			<PostForm
				initialData={initialData}
				onSubmit={handleSubmit}
				disabled={isSubmitting}
				submitButtonText="Update Post"
			/>
		</Box>
	);
};

export default PostEditPage;
