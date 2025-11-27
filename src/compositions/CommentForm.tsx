// src/compositions/CommentForm.tsx
import React, { useState } from 'react';
import { Box, Stack, Heading } from '@chakra-ui/react';
import { Alert, AlertIcon } from '@chakra-ui/alert';
import type { FormEventHandler } from 'react';
import { TextareaField } from './form-elements'; // Import custom TextareaField
import Button from './button'; // Import custom Button

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, isLoading, errorMessage }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      // Basic client-side validation
      return;
    }
    await onSubmit(content);
    setContent(''); // Clear form after submission
  };

  return (
    <Box mt={8} p={5} shadow="md" borderWidth="1px" borderRadius="lg">
      <Heading size="md" mb={4}>Add a Comment</Heading>
      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          {errorMessage && (
            <Alert status="error">
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}
          <TextareaField
            label="Your Comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment here..."
            disabled={isLoading}
            rows={4}
            error={errorMessage ? { message: errorMessage, type: "manual" } : undefined} // Pass error to TextareaField
          />
          <Button type="submit" variant="primary" isLoading={isLoading} disabled={!content.trim()}>
            Submit Comment
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default CommentForm;
