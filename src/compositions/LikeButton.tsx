// src/compositions/LikeButton.tsx
import React, { useState, useEffect } from "react";
import { Icon, Text } from "@chakra-ui/react"; // Import Icon explicitly
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { createLike, deleteLike } from "../use-cases/like-cases";
import { useAuth } from "../store/auth";
import type { Post } from "../types/api";
import Button from "./button"; // Import custom Button
import { toaster } from "./toaster"; // Import the toaster

interface LikeButtonProps {
  postId: number;
  initialLikesCount: number;
  userHasLikedInitial: boolean;
  post?: Post;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, initialLikesCount, userHasLikedInitial, post }) => {
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [userHasLiked, setUserHasLiked] = useState(userHasLikedInitial);
  const [loading, setLoading] = useState(false);
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    setLikesCount(initialLikesCount);
    setUserHasLiked(userHasLikedInitial);
  }, [initialLikesCount, userHasLikedInitial]);

  const handleLikeToggle = async () => {
    if (!isLoggedIn || !user?.id) {
      toaster.error("You must be logged in to like posts."); // Use toaster
      return;
    }

    setLoading(true);

    try {
      if (userHasLiked) {
        const likeToDelete = post?.likes?.find(like => like.userId === user.id);
        if (likeToDelete) {
            await deleteLike(likeToDelete.id);
            setLikesCount((prev) => prev - 1);
            setUserHasLiked(false);
        } else {
            toaster.error("Could not find your like to remove."); // Use toaster
        }

      } else {
        await createLike({ postId, userId: user.id });
        setLikesCount((prev) => prev + 1);
        setUserHasLiked(true);
      }
    } catch (err: any) {
      toaster.error(err.message || "Failed to toggle like."); // Use toaster
      // Revert state if API call fails
      setUserHasLiked(!userHasLiked);
      setLikesCount(userHasLiked ? likesCount + 1 : likesCount - 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLikeToggle}
      isLoading={loading}
      disabled={!isLoggedIn}
      variant="ghost" // Use custom ghost variant
      leftIcon={<Icon as={userHasLiked ? FaHeart : FaRegHeart} color={userHasLiked ? "red.500" : "gray.500"} />}
      colorScheme={userHasLiked ? "red" : "gray"} // Keep colorScheme for icon color
    >
      <Text mr={1}>{likesCount}</Text>
      Likes
    </Button>
  );
};

export default LikeButton;