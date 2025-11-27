/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Blog, Post } from "../types/api";
import { getBlogById } from "../use-cases/blog-cases";
import { Box, Heading, Text, SimpleGrid, VStack } from "@chakra-ui/react";
import PostCard from "../compositions/PostCard";
import { toaster } from "../compositions/toaster"; // Import the toaster
import { EmptyState } from "../compositions/empty-state"; // Import EmptyState

const BlogDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const blogId = Number(id);
	const [blog, setBlog] = useState<Blog | null>(null);
	const [posts, setPosts] = useState<Post[]>([]);
	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			if (isNaN(blogId)) {
				toaster.error({ title: "Invalid Blog ID." });
				setDisabled(false);
				return;
			}
			try {
				const blogData = await getBlogById(blogId);
				setBlog(blogData);
				setPosts(blogData.posts);
			} catch (err: any) {
				toaster.error({
					title: err.message || "Failed to fetch blog details.",
				});
				setBlog(null);
				setPosts([]);
			} finally {
				setDisabled(false);
			}
		};
		fetchData();
	}, [blogId]);

	if (disabled) {
		return (
			<EmptyState
				title="Loading Blog..."
				description="Please wait while we fetch the blog details and its posts."
			/>
		);
	}

	if (!blog) {
		return (
			<EmptyState
				title="Blog Not Found"
				description="The blog you are looking for does not exist or an error occurred."
			/>
		);
	}

	return (
		<Box p={4}>
			<VStack align="start" gap={4}>
				<Heading as="h1" size="xl" mb={4}>
					{blog.title}
				</Heading>
				<Text fontSize="lg" mb={6}>
					{blog.description}
				</Text>

				<Heading as="h2" size="lg" mt={8} mb={4}>
					Posts in this Blog
				</Heading>
				{posts.length > 0 ? (
					<SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={6}>
						{posts.map((post) => (
							<PostCard key={post.id} post={post} />
						))}
					</SimpleGrid>
				) : (
					<EmptyState
						title="No Posts"
						description="No posts found for this blog yet."
					/>
				)}
			</VStack>
		</Box>
	);
};

export default BlogDetailPage;
