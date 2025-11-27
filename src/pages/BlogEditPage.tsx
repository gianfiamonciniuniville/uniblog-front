// src/pages/BlogEditPage.tsx
import React, { useEffect, useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import BlogForm from "../compositions/BlogForm";
import { getBlogById, updateBlog } from "../use-cases/blog-cases";
import { useNavigate, useParams } from "react-router-dom";
import type { BlogUpdateDto, Blog } from "../types/api";
import { useAuth } from "../store/auth";
import { toaster } from "../compositions/toaster"; // Import the toaster
import { EmptyState } from "../compositions/empty-state"; // Import EmptyState

const BlogEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const blogId = Number(id);
  const [initialData, setInitialData] = useState<Blog | null>(null);
  const [disabled, setDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchBlog = async () => {
      if (isNaN(blogId)) {
        toaster.error("Invalid Blog ID."); // Use toaster
        setDisabled(false);
        return;
      }
      try {
        const data = await getBlogById(blogId);
        if (user && data.userId === user.id) {
          setInitialData(data);
        } else {
          toaster.error("You are not authorized to edit this blog."); // Use toaster
          navigate("/blogs"); // Redirect to blogs list
        }
      } catch (err: any) {
        toaster.error(err.message || "Failed to load blog for editing."); // Use toaster
      } finally {
        setDisabled(false);
      }
    };
    fetchBlog();
  }, [blogId, user, navigate]);

  const handleSubmit = async (data: BlogUpdateDto) => {
    setIsSubmitting(true);
    try {
      await updateBlog(blogId, data);
      toaster.success("Blog updated successfully!"); // Use toaster
      navigate(`/blogs/${blogId}`); // Redirect to blog detail on success
    } catch (err: any) {
      toaster.error(err.message || "Failed to update blog."); // Use toaster
    } finally {
      setIsSubmitting(false);
    }
  };

  if (disabled) {
    return (
      <EmptyState
        title="Loading Blog..."
        description="Please wait while we fetch the blog details."
      />
    );
  }

  if (!initialData) {
    return (
      <EmptyState
        title="Blog Not Found or Unauthorized"
        description="The blog you are looking for does not exist or you do not have permission to edit it."
      />
    );
  }

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={6}>
        Edit Blog
      </Heading>
      <BlogForm
        initialData={initialData}
        onSubmit={handleSubmit}
        disabled={isSubmitting}
        submitButtonText="Update Blog"
      />
    </Box>
  );
};

export default BlogEditPage;
