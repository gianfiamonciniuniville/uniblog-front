// src/pages/AuthorPostListPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Post, UserDto } from "../types/api";
import { getPostsByAuthor, deletePost } from "../use-cases/post-cases";
import { getUserById } from "../use-cases/user-cases";
import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import PostCard from "../compositions/PostCard";
import { useAuth } from "../store/auth";
import { toaster } from "../compositions/toaster"; // Import the toaster
import { EmptyState } from "../compositions/empty-state"; // Import EmptyState

const AuthorPostListPage: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const parsedAuthorId = Number(authorId);
  const [posts, setPosts] = useState<Post[]>([]);
  const [author, setAuthor] = useState<UserDto | null>(null);
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();
  const { user: currentUser, isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchAuthorAndPosts = async () => {
      if (isNaN(parsedAuthorId)) {
        toaster.error("Invalid Author ID."); // Use toaster
        setDisabled(false);
        return;
      }
      try {
        const [postsData, authorData] = await Promise.all([
          getPostsByAuthor(parsedAuthorId),
          getUserById(parsedAuthorId),
        ]);
        setPosts(postsData);
        setAuthor(authorData);
      } catch (err: any) {
        toaster.error(err.message || "Failed to fetch author's posts."); // Use toaster
      } finally {
        setDisabled(false);
      }
    };
    fetchAuthorAndPosts();
  }, [parsedAuthorId]);

  const handleDeletePost = async (postIdToDelete: number) => {
    if (!isLoggedIn || currentUser?.id !== parsedAuthorId) {
      toaster.error("You are not authorized to delete this post."); // Use toaster
      return;
    }

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postIdToDelete);
        toaster.success("Post deleted successfully!"); // Use toaster
        setPosts(posts.filter((post) => post.id !== postIdToDelete));
      } catch (err: any) {
        toaster.error(err.message || "Failed to delete post."); // Use toaster
      }
    }
  };

  const handleEditPost = (postIdToEdit: number) => {
    if (!isLoggedIn || currentUser?.id !== parsedAuthorId) {
        toaster.error("You are not authorized to edit this post."); // Use toaster
        return;
    }
    const postToEdit = posts.find(p => p.id === postIdToEdit);
    if (postToEdit) {
        navigate(`/posts/edit/${postToEdit.id}`);
    }
  };

  if (disabled) {
    return (
      <EmptyState
        title="Loading Posts..."
        description="Please wait while we fetch the author's posts."
      />
    );
  }

  if (!author) {
    return (
      <EmptyState
        title="Author Not Found"
        description="The author you are looking for does not exist."
      />
    );
  }

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={6}>
        Posts by {author.userName}
      </Heading>
      {posts.length > 0 ? (
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={6}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              showAuthor={false}
              onEdit={isLoggedIn && currentUser?.id === parsedAuthorId ? handleEditPost : undefined}
              onDelete={isLoggedIn && currentUser?.id === parsedAuthorId ? handleDeletePost : undefined}
            />
          ))}
        </SimpleGrid>
      ) : (
        <EmptyState
            title="No Posts"
            description={`No posts found for ${author.userName}.`}
        />
      )}
    </Box>
  );
};

export default AuthorPostListPage;