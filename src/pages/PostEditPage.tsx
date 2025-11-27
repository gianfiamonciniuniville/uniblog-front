// src/pages/PostEditPage.tsx
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
        toaster.error("Invalid Post ID."); // Use toaster
        setDisabled(false);
        return;
      }
      try {
        const data = await getPostById(postId);

        if (user && data.authorId === user.id) {
          setInitialData(data);
        } else {
          toaster.error("You are not authorized to edit this post."); // Use toaster
          navigate("/"); // Redirect to home page
        }

      } catch (err: any) {
        toaster.error(err.message || "Failed to load post for editing."); // Use toaster
      } finally {
        setDisabled(false);
      }
    };
    fetchPost();
  }, [postId, user, navigate]); // Added navigate to dependency array

  const handleSubmit = async (data: PostUpdateDto) => {
    setIsSubmitting(true);
    try {
      if (!initialData?.id) {
        toaster.error("Post ID not found for update."); // Use toaster
        setIsSubmitting(false);
        return;
      }
      await updatePost(initialData.id, data);
      toaster.success("Post updated successfully!"); // Use toaster
      navigate(`/posts/${data.slug || initialData.slug}`); // Redirect to post detail on success
    } catch (err: any) {
      toaster.error(err.message || "Failed to update post."); // Use toaster
    } finally {
      setIsSubmitting(false);
    }
  };

  if (disabled) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="70vh">
        {/* Using a generic loading spinner or skeleton instead of direct Chakra Spinner here */}
        <EmptyState title="Loading Post..." description="Please wait while we fetch the post details."/>
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