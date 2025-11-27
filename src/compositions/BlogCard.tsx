// src/compositions/BlogCard.tsx
import React from "react";
import type { Blog } from "../types/api";
import { Link } from "react-router-dom";
import { Box, Heading, Text, Button, Stack } from "@chakra-ui/react";

interface BlogCardProps {
	blog: Blog;
	onEdit?: (id: number) => void;
	onDelete?: (id: number) => void;
	showAuthor?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({
	blog,
	onEdit,
	onDelete,
	showAuthor = false,
}) => {
	return (
		<Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
			<Link to={`/blogs/${blog.id}`}>
				{" "}
				<Heading fontSize="xl">{blog.title}</Heading>
			</Link>
			<Text mt={4}>{blog.description}</Text>
			{showAuthor && (
				<Text mt={2} fontSize="sm">
					Author: {blog.user.userName}
				</Text>
			)}
			<Stack direction="row" mt={4}>
				<Link to={`/blogs/${blog.id}`}>
					<Button colorScheme="blue" size="sm">
						View Blog
					</Button>
				</Link>
				{onEdit && (
					<Button
						colorScheme="yellow"
						size="sm"
						onClick={() => onEdit(blog.id)}>
						Edit
					</Button>
				)}
				{onDelete && (
					<Button colorScheme="red" size="sm" onClick={() => onDelete(blog.id)}>
						Delete
					</Button>
				)}
			</Stack>
		</Box>
	);
};

export default BlogCard;
