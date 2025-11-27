import React from "react";
import type { Post } from "../types/api"; // Changed to type-only import
import { Link } from "react-router-dom";
import { Box, Heading, Text, Button, Stack } from "@chakra-ui/react";

interface PostCardProps {
	post: Post;
	onEdit?: (id: number) => void;
	onDelete?: (id: number) => void;
	showAuthor?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
	post,
	onEdit,
	onDelete,
	showAuthor = false,
}) => {
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
			<Stack direction="row" mt={4}>
				{" "}
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
			</Stack>
		</Box>
	);
};

export default PostCard;
