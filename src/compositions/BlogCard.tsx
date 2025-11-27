// src/compositions/BlogCard.tsx
import React from "react";
import type { Blog } from "../types/api";
import { Link } from "react-router-dom";
import { Box, Heading, Text, Stack } from "@chakra-ui/react"; // Remove Button from here
import Button from "./button"; // Import custom Button

interface BlogCardProps {
	blog: Blog;
	onEdit?: (id: number) => void;
	onDelete?: (id: number) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onEdit, onDelete }) => {
	return (
		<Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
			<Link to={`/blogs/${blog.id}`}>
				<Heading fontSize="xl">{blog.title}</Heading>
			</Link>
			<Text mt={4}>{blog.description}</Text>
			<Stack direction="row" gap={4} mt={4}>
				<Link to={`/blogs/${blog.id}`}>
					<Button variant="solid" size="sm">
						View Details
					</Button>
				</Link>
				{onEdit && (
					<Button variant="outline" size="sm" onClick={() => onEdit(blog.id)}>
						Edit
					</Button>
				)}
				{onDelete && (
					<Button
						variant="solid"
						size="sm"
						onClick={() => onDelete(blog.id)}
						colorScheme="red">
						Delete
					</Button>
				)}
			</Stack>
		</Box>
	);
};

export default BlogCard;
