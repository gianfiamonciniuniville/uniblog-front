// src/compositions/CommentList.tsx
import React from "react";
import { Box, Text, Heading, Flex, Link as ChakraLink } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/layout";
import type { CommentDto } from "../types/api";
import { useAuth } from "../store/auth";
import { Link as RouterLink } from "react-router-dom"; // Import Link as RouterLink
import Button from "./button"; // Import custom Button
import { EmptyState } from "./empty-state"; // Import EmptyState

interface CommentListProps {
	comments: CommentDto[];
	onDeleteComment: (commentId: number) => Promise<void>;
}

const CommentList: React.FC<CommentListProps> = ({
	comments,
	onDeleteComment,
}) => {
	const { user } = useAuth();

	if (comments.length === 0) {
		return (
			<Box mt={8}>
				<EmptyState
					title="No comments yet"
					description="Be the first to leave a comment!"
				/>
			</Box>
		);
	}

	return (
		<Box mt={8} w={"100%"}>
			<Heading size="md" mb={4}>
				Comments
			</Heading>
			<VStack gap={4} align="stretch">
				{comments.map((comment) => (
					<Box
						key={comment.id}
						p={4}
						shadow="sm"
						borderWidth="1px"
						borderRadius="md"
						w={"100%"}>
						<Flex justifyContent="space-between" alignItems="center">
							<Text fontSize="sm" color="gray.500">
								<ChakraLink
									as={RouterLink}
									href={`/profile/${comment.user.id}`}
									color="blue.500"
									fontWeight="bold">
									{comment.user.userName}
								</ChakraLink>{" "}
								says:
							</Text>
							{user?.id === comment.user.id && (
								<Button
									variant="outline"
									colorScheme="red"
									size="xs"
									onClick={() => onDeleteComment(comment.id)}>
									Delete
								</Button>
							)}
						</Flex>
						<Text mt={1}>{comment.content}</Text>
					</Box>
				))}
			</VStack>
		</Box>
	);
};

export default CommentList;
