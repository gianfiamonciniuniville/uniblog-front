/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Box, Heading, Spinner } from "@chakra-ui/react";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import UserProfileForm from "../compositions/UserProfileForm";
import { getUserById, updateUserProfile } from "../use-cases/user-cases";
import { useParams } from "react-router-dom";
import type { UserDto, UpdateUserProfileDto } from "../types/api";
import { useAuth } from "../store/auth";
import { toaster } from "../compositions/toaster"; // Import the toaster

const UserProfilePage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const userId = Number(id);
	const [initialData, setInitialData] = useState<UserDto | null>(null);
	const [disabled, setDisabled] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { user: currentUser } = useAuth();

	useEffect(() => {
		const fetchUser = async () => {
			if (isNaN(userId)) {
				setErrorMessage("Invalid User ID.");
				setDisabled(false);
				return;
			}
			try {
				const data = await getUserById(userId);
				if (currentUser?.id === data.id) {
					setInitialData(data);
				} else {
					setErrorMessage(
						"You are not authorized to view or edit this profile."
					);
				}
			} catch (err: any) {
				setErrorMessage(err.message || "Failed to load user profile.");
			} finally {
				setDisabled(false);
			}
		};
		fetchUser();
	}, [userId, currentUser]);

	const handleSubmit = async (data: UpdateUserProfileDto) => {
		setIsSubmitting(true);
		setErrorMessage(null);
		try {
			if (!currentUser?.id) {
				setErrorMessage("User not authenticated.");
				setIsSubmitting(false);
				return;
			}
			await updateUserProfile(currentUser.id, data);
			toaster.success({ title: "Profile updated successfully!" }); // Use toaster for success
			// Optionally re-fetch user data to update the global auth state if needed
			// Or simply update the local state to reflect changes without a full re-fetch
		} catch (err: any) {
			toaster.error(err.message || "Failed to update profile."); // Use toaster for error
			setErrorMessage(err.message || "Failed to update profile.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (disabled) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minH="70vh">
				<Spinner size="xl" />
			</Box>
		);
	}

	if (errorMessage && !initialData) {
		return (
			<Alert status="error">
				<AlertIcon />
				{errorMessage}
			</Alert>
		);
	}

	if (!initialData) {
		return (
			<Alert status="info">
				<AlertIcon />
				User profile not found or you are not authorized to view/edit it.
			</Alert>
		);
	}

	return (
		<Box p={4}>
			<Heading as="h1" size="xl" mb={6}>
				User Profile
			</Heading>
			<UserProfileForm
				initialData={initialData}
				onSubmit={handleSubmit}
				disabled={isSubmitting}
				errorMessage={errorMessage}
				submitButtonText="Update Profile"
			/>
		</Box>
	);
};

export default UserProfilePage;
