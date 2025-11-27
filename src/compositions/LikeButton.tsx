/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Icon, Text } from "@chakra-ui/react"; // Import Icon explicitly
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { createLike, deleteLike } from "../use-cases/like-cases";
import { useAuth } from "../store/auth";
import type { LikeDto, Post } from "../types/api";
import Button from "./button"; // Import custom Button
import { toaster } from "./toaster"; // Import the toaster

interface LikeButtonProps {
	postId: number;
	initialLikesCount: number;
	userHasLikedInitial: boolean;
	post?: Post;
	findLikeOfUser?: LikeDto;
	fetchPost?: () => Promise<void>;
}

const LikeButton: React.FC<LikeButtonProps> = ({
	postId,
	initialLikesCount,
	userHasLikedInitial,
	findLikeOfUser,
	fetchPost,
}) => {
	const [loading, setLoading] = useState(false);
	const { user, isLoggedIn } = useAuth();

	const userHasLiked = userHasLikedInitial;

	const handleLikeToggle = async () => {
		if (!isLoggedIn || !user?.id) {
			toaster.error({ title: "You must be logged in to like posts." });
			return;
		}

		setLoading(true);

		try {
			if (userHasLiked) {
				await deleteLike(findLikeOfUser?.id || 0);
			} else {
				await createLike({ postId, userId: user.id });
			}
		} catch (err: any) {
			toaster.error({ title: "Failed to toggle like." + (err.message || "") });
		} finally {
			setLoading(false);
			if (fetchPost) {
				await fetchPost();
			}
		}
	};

	return (
		<Button
			onClick={handleLikeToggle}
			loading={loading}
			disabled={!isLoggedIn}
			variant="ghost"
			colorScheme={userHasLiked ? "red" : "gray"}>
			<Icon
				as={userHasLiked ? FaHeart : FaRegHeart}
				color={userHasLiked ? "red.500" : "gray.500"}
			/>
			<Text mr={1}>{initialLikesCount}</Text>
			Likes
		</Button>
	);
};

export default LikeButton;
