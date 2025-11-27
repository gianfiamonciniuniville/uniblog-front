/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import type { Post } from "../types/api"; // Changed to type-only import
import { Link } from "react-router-dom";
import { Box, Heading, Text, Button, Stack, Switch } from "@chakra-ui/react";
import { useAuth } from "../store/auth";
import { publishPost } from "../use-cases/post-cases";
import { toaster } from "../compositions/toaster";
import { FormControl, FormLabel } from "@chakra-ui/form-control";

interface PostCardProps {
	post: Post;
	onEdit?: (id: number) => void;
	onDelete?: (id: number) => void;
	showAuthor?: boolean;
	onPostStatusChange?: (postId: number, isPublished: boolean) => void; // New prop
}

const PostCard: React.FC<PostCardProps> = ({
	post,
	onEdit,
	onDelete,
	showAuthor = false,
	onPostStatusChange,
}) => {
	const { user, isLoggedIn } = useAuth();
	const isAuthor = isLoggedIn && user?.id === post.author.id;
	const [isToggling, setIsToggling] = useState(false);

	const handleTogglePublish = async (isChecked: boolean) => {
		setIsToggling(true);
		try {
			if (isChecked) {
				await publishPost(post.id);
				toaster.success({ title: "Post published successfully!" });
			} else {
				await publishPost(post.id); // Is a publish toggle, so we call the same function
				toaster.success({ title: "Post unpublished successfully!" });
			}
			onPostStatusChange?.(post.id, isChecked);
		} catch (err: any) {
			toaster.error({
				title: err.message || "Failed to change post publish status.",
			});
		} finally {
			setIsToggling(false);
		}
	};

	return (
		<Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
			<Link to={`/posts/${post.slug}`}>
				<Heading fontSize="xl">{post.title}</Heading>
			</Link>
			<Text mt={4}>{post.content}</Text>
			{showAuthor && (
				<Text mt={2} fontSize="sm">
					Author: {post.author.userName}
				</Text>
			)}
			<Stack direction="row" mt={4} alignItems="center">
				<Link to={`/posts/${post.slug}`}>
					<Button colorScheme="blue" size="sm">
						Read More
					</Button>
				</Link>
				{onEdit && (
					<Button
						colorScheme="yellow"
						size="sm"
						onClick={() => onEdit(post.id)}>
						Edit
					</Button>
				)}
				{onDelete && (
					<Button colorScheme="red" size="sm" onClick={() => onDelete(post.id)}>
						Delete
					</Button>
				)}
				{isAuthor && (
					<FormControl display="flex" alignItems="center" ml={4}>
						<FormLabel htmlFor={`publish-toggle-${post.id}`} mb="0">
							{post.published ? "Published" : "Unpublished"}
						</FormLabel>
						<Switch.Root
							id={`publish-toggle-${post.id}`}
							checked={post.published}
							onCheckedChange={(e) => handleTogglePublish(e.checked as boolean)}
							disabled={isToggling}>
							<Switch.HiddenInput />
							<Switch.Control>
								<Switch.Thumb />
							</Switch.Control>
							<Switch.Label />
						</Switch.Root>
					</FormControl>
				)}
			</Stack>
		</Box>
	);
};

export default PostCard;
