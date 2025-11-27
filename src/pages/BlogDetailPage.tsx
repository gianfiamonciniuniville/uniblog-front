// src/pages/BlogDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import type { Blog, Post } from "../types/api";
import { getBlogById } from "../use-cases/blog-cases";
import { getPostsByBlogId } from "../use-cases/post-cases";
import { Box, Heading, Text, SimpleGrid, Link as ChakraLink, VStack } from "@chakra-ui/react";
import PostCard from "../compositions/PostCard";
import { toaster } from "../compositions/toaster"; // Import the toaster
import { EmptyState } from "../compositions/empty-state"; // Import EmptyState

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const blogId = Number(id);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [disabled, setDisabled] = useState(true);
  // Removed error state as toaster will handle display

  useEffect(() => {
    const fetchData = async () => {
      if (isNaN(blogId)) {
        toaster.error("Invalid Blog ID.");
        setDisabled(false);
        return;
      }
      try {
        const blogData = await getBlogById(blogId);
        setBlog(blogData);
        const postsData = await getPostsByBlogId(blogId);
        setPosts(postsData);
      } catch (err: any) {
        toaster.error(err.message || "Failed to fetch blog details.");
        // Set blog and posts to null to trigger EmptyState for not found/error
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
        <Heading as="h1" size="xl" mb={4}>{blog.title}</Heading>
        <Text fontSize="lg" mb={6}>{blog.description}</Text>

        <Heading as="h2" size="lg" mt={8} mb={4}>Posts in this Blog</Heading>
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
