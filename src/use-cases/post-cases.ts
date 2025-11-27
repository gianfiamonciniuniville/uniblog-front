// src/use-cases/post-cases.ts
import { get, post, put, remove } from "./api-client";
import type { Post, PostCreateDto, PostUpdateDto } from "../types/api"; // Added 'type' keyword for imports

export const getAllPosts = async () => {
	try {
		const response = await get<Post[]>("/Post/all");
		return response;
	} catch (error) {
		console.error("Error fetching all posts:", error);
		throw error;
	}
};

// New function: getPostById
export const getPostById = async (id: number) => {
	try {
		// Since there's no direct API for /Post/{id} GET, we fetch all and filter
		const allPosts = await getAllPosts();
		const post = allPosts.find((p) => p.id === id);
		if (!post) {
			throw new Error(`Post with ID ${id} not found.`);
		}
		return post;
	} catch (error) {
		console.error(`Error fetching post by ID ${id}:`, error);
		throw error;
	}
};

export const createPost = async (data: PostCreateDto) => {
	try {
		const response = await post<Post>("/Post", data);
		return response;
	} catch (error) {
		console.error("Error creating post:", error);
		throw error;
	}
};

export const updatePost = async (id: number, data: PostUpdateDto) => {
	try {
		const response = await put<Post>(`/Post/${id}`, data);
		return response;
	} catch (error) {
		console.error(`Error updating post with ID ${id}:`, error);
		throw error;
	}
};

// New function: deletePost
export const deletePost = async (id: number) => {
	try {
		const response = await remove<void>(`/Post/${id}`);
		return response;
	} catch (error) {
		console.error(`Error deleting post with ID ${id}:`, error);
		throw error;
	}
};

export const publishPost = async (id: number) => {
	try {
		const response = await post<void>(`/Post/${id}/publish`, {}); // Empty body for post request
		return response;
	} catch (error) {
		console.error(`Error publishing post with ID ${id}:`, error);
		throw error;
	}
};

export const getPostBySlug = async (slug: string) => {
	try {
		const response = await get<Post>(`/Post/slug/${slug}`);
		return response;
	} catch (error) {
		console.error(`Error fetching post with slug ${slug}:`, error);
		throw error;
	}
};

export const getPostsByAuthor = async (authorId: number) => {
	try {
		const response = await get<Post[]>(`/Post/author/${authorId}`);
		return response;
	} catch (error) {
		console.error(`Error fetching posts by author with ID ${authorId}:`, error);
		throw error;
	}
};

export const getPostsByBlogId = async (blogId: number) => {
	try {
		const allPosts = await getAllPosts();
		const filteredPosts = allPosts.filter((post) => post.blog.id === blogId);
		return filteredPosts;
	} catch (error) {
		console.error(`Error fetching posts for blog with ID ${blogId}:`, error);
		throw error;
	}
};
