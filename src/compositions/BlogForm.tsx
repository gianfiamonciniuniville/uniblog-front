// src/compositions/BlogForm.tsx
import React, { useState, useEffect } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import type { BlogCreateDto, BlogUpdateDto, Blog } from "../types/api";
import { InputField, TextareaField } from "./form-elements"; // Import custom InputField and TextareaField
import Button from "./button"; // Import custom Button

interface BlogFormProps {
  initialData?: Blog; // For editing existing blogs
  onSubmit: (data: BlogCreateDto | BlogUpdateDto) => Promise<void>;
  disabled?: boolean;
  errorMessage?: string | null;
  submitButtonText?: string;
}

const BlogForm: React.FC<BlogFormProps> = ({
  initialData,
  onSubmit,
  disabled,
  errorMessage,
  submitButtonText = "Submit",
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      await onSubmit({ title, description }); // For update
    } else {
      // userId will be added in the page component where the form is used
      await onSubmit({ title, description, userId: 0 }); // Placeholder userId for create
    }
  };

  return (
    <Box maxW="lg" mx="auto" mt="10" p={5} shadow="md" borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          {errorMessage && (
            <Alert status="error">
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}
          <InputField
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={disabled}
            isRequired
          />
          <TextareaField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={disabled}
            rows={5}
            isRequired
          />
          <Button type="submit" variant="primary" isLoading={disabled}>
            {submitButtonText}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default BlogForm;