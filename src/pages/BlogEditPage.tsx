// src/pages/BlogEditPage.tsx
import React, { useEffect, useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import BlogForm from "../compositions/BlogForm";
import { getBlogById, updateBlog } from "../use-cases/blog-cases";
import { useNavigate, useParams } from "react-router-dom";
import type { BlogUpdateDto, Blog } from "../types/api";
import { useAuth } from "../store/auth";
import { toaster } from "../compositions/toaster";
import { EmptyState } from "../compositions/empty-state";

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
        toaster.error("Invalid Blog ID.");
        setDisabled(false);
        return;
      }
      try {
        const data = await getBlogById(blogId);

        if (user && data.authorId === user.id) {
          setInitialData(data);
        } else {
          toaster.error("You are not authorized to edit this blog.");
          navigate("/"); // Redirect to home page
        }

      } catch (err: unknown) {
        toaster.error((err as Error).message || "Failed to load blog for editing.");
      } finally {
        setDisabled(false);
      }
    };
    fetchBlog();
  }, [blogId, user, navigate]);

  const handleSubmit = async (data: BlogUpdateDto) => {
    setIsSubmitting(true);
    try {
      if (!initialData?.id) {
        toaster.error("Blog ID not found for update.");
        setIsSubmitting(false);
        return;
      }
      await updateBlog(initialData.id, data);
      toaster.success("Blog updated successfully!");
      navigate(`/blogs/${initialData.id}`); // Redirect to blog detail on success (assuming a blog detail page exists)
    } catch (err: unknown) {
      toaster.error((err as Error).message || "Failed to update blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (disabled) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="70vh">
        <EmptyState title="Loading Blog..." description="Please wait while we fetch the blog details."/>
      </Box>
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