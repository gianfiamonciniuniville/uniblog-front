// src/pages/PostListPage.tsx
import React, { useEffect, useState } from "react";
import type { Post } from "../types/api"; // type-only import
import { getAllPosts } from "../use-cases/post-cases";
import { Box, Heading, SimpleGrid, Spinner, Button } from "@chakra-ui/react"; // Box, Heading, SimpleGrid, Spinner, Button from react
import { Alert, AlertIcon } from "@chakra-ui/alert"; // Alert and AlertIcon from alert
import PostCard from "../compositions/PostCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const PostListPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [disabled, setDisabled] = useState(true); // Changed from isLoading
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); // Removed currentUser as it was unused

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch posts.");
      } finally {
        setDisabled(false); // Changed from setIsLoading
      }
    };
    fetchPosts();
  }, []);

  if (disabled) { // Changed from isLoading
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="70vh">
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

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={6}>
        All Posts
      </Heading>
      {isLoggedIn && (
        <Button colorScheme="green" onClick={() => navigate("/posts/create")} mb={6}>
          Create New Post
        </Button>
      )}
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={6}> {/* Changed spacing to gap */}
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            showAuthor={true} // Optionally show author on list page
            // onEdit={isLoggedIn && currentUser?.id === post.authorId ? handleEdit : undefined}
            // onDelete={isLoggedIn && currentUser?.id === post.authorId ? handleDelete : undefined}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PostListPage;