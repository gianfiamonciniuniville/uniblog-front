import React, { useEffect, useMemo, useState } from "react";
import {
	Box,
	Heading,
	HStack,
	RadioGroup,
	SimpleGrid,
	VStack,
} from "@chakra-ui/react";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import PostCard from "../compositions/PostCard";
import { getAllPosts } from "../use-cases/post-cases";
import type { Post } from "../types/api";
import { EmptyState } from "../compositions/empty-state";
import { SkeletonText, Skeleton } from "../compositions/skeleton"; // Assuming Skeleton is imported from here

export const HomePage: React.FC = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filterStatus, setFilterStatus] = useState<
		"all" | "published" | "unpublished"
	>("all");

	const filteredPosts = useMemo(() => {
		if (filterStatus === "all") {
			return posts;
		} else if (filterStatus === "published") {
			return posts.filter((post) => post.published);
		} else {
			return posts.filter((post) => post.published == false);
		}
	}, [posts, filterStatus]);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true);
				const fetchedPosts = await getAllPosts();
				setPosts(fetchedPosts);
			} catch (err: any) {
				setError(err.message || "Failed to fetch posts.");
			} finally {
				setLoading(false);
			}
		};
		fetchPosts();
	}, []);

	if (loading) {
		return (
			<VStack spaceY={4} align="stretch" p={4}>
				<Skeleton height="30px" width="200px" mb={4} />
				<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spaceY={4} spaceX={4}>
					{Array.from({ length: 6 }).map((_, index) => (
						<Box
							key={index}
							p={5}
							shadow="md"
							borderWidth="1px"
							borderRadius="lg">
							<Skeleton height="20px" mb={2} />
							<SkeletonText mt="4" noOfLines={4} spaceY={4} spaceX={4} />
							<Skeleton height="30px" width="100px" mt={4} />
						</Box>
					))}
				</SimpleGrid>
			</VStack>
		);
	}

	if (error) {
		return (
			<Alert status="error" mt={4}>
				<AlertIcon />
				{error}
			</Alert>
		);
	}

	if (posts.length === 0) {
		return (
			<EmptyState
				title="No Posts Found"
				description="There are no posts available yet. Check back later!"
			/>
		);
	}

	return (
		<Box p={4}>
			<Heading as="h1" size="xl" mb={6}>
				Latest Posts
			</Heading>

			<RadioGroup.Root
				value={filterStatus}
				onValueChange={(e) => setFilterStatus(e.value as any)}
				marginBottom={4}>
				<HStack gap={6}>
					{[
						{ value: "all", label: "All" },
						{ value: "published", label: "Published" },
						{ value: "unpublished", label: "Unpublished" },
					].map((item) => (
						<RadioGroup.Item key={item.value} value={item.value}>
							<RadioGroup.ItemHiddenInput />
							<RadioGroup.ItemIndicator />
							<RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
						</RadioGroup.Item>
					))}
				</HStack>
			</RadioGroup.Root>

			<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spaceY={4} spaceX={4}>
				{filteredPosts.length > 0 &&
					filteredPosts.map((post) => (
						<PostCard key={post.id} post={post} showAuthor={true} />
					))}
			</SimpleGrid>
		</Box>
	);
};
