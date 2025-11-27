// src/compositions/UserProfileForm.tsx
import React, { useState, useEffect } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import type { UserDto, UpdateUserProfileDto } from "../types/api";
import { InputField, TextareaField } from "./form-elements"; // Import custom InputField and TextareaField
import Button from "./button"; // Import custom Button

interface UserProfileFormProps {
  initialData?: UserDto; // For displaying existing user data
  onSubmit: (data: UpdateUserProfileDto) => Promise<void>;
  disabled?: boolean;
  errorMessage?: string | null;
  submitButtonText?: string;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  initialData,
  onSubmit,
  disabled,
  errorMessage,
  submitButtonText = "Update Profile",
}) => {
  const [bio, setBio] = useState(initialData?.bio || "");
  const [profileImageUrl, setProfileImageUrl] = useState(initialData?.profileImageUrl || "");

  useEffect(() => {
    if (initialData) {
      setBio(initialData.bio || "");
      setProfileImageUrl(initialData.profileImageUrl || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ bio, profileImageUrl });
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
          {/* Read-only fields using Chakra's Input */}
          <InputField label="Username" type="text" value={initialData?.userName || ""} readOnly disabled={disabled} />
          <InputField label="Email" type="email" value={initialData?.email || ""} readOnly disabled={disabled} />

          <TextareaField
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={disabled}
            placeholder="Tell us about yourself..."
          />
          <InputField
            label="Profile Image URL"
            type="url"
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
            disabled={disabled}
            placeholder="https://example.com/your-image.jpg"
          />
          <Button type="submit" colorScheme="blue" variant="solid" loading={disabled}>
            {submitButtonText}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default UserProfileForm;