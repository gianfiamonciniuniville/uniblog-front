import { post } from "./../use-cases/api-client";
// src/types/api.ts

export interface BlogCreateDto {
	title?: string | null;
	description?: string | null;
	userId: number;
}

export interface BlogUpdateDto {
	title?: string | null;
	description?: string | null;
}

export interface CommentCreateDto {
	content?: string | null;
	postId: number;
	userId: number;
}

export interface LikeCreateDto {
	postId: number;
	userId: number;
}

export interface LoginUserDto {
	email?: string | null;
	password?: string | null;
}

export interface PostCreateDto {
	title?: string | null;
	content?: string | null;
	slug?: string | null;
	authorId: number;
	blogId: number;
}

export interface PostUpdateDto {
	title?: string | null;
	content?: string | null;
	slug?: string | null;
}

export interface RegisterUserDto {
	userName?: string | null;
	email?: string | null;
	password?: string | null;
}

export interface UpdateUserProfileDto {
	bio?: string | null;
	profileImageUrl?: string | null;
}

// User types
export interface UserShortDto {
	id: number;
	userName: string;
}

export interface UserDto {
	id: number;
	userName: string;
	email: string;
	profileImageUrl?: string | null;
	bio?: string | null;
	role: string; // Assuming 'role' is a property from the backend
}

export interface AuthResponseDto {
	token: string;
	user: UserDto;
}

// Blog types
export interface Blog {
	id: number;
	title: string;
	description: string;
	userId: number;
	// Add other blog properties if they come from the API
}

// Comment types
export interface CommentDto {
	id: number;
	content: string;
	postId: number; // Added postId to CommentDto for clarity
	user: UserShortDto;
	// Add other comment properties
}

// Like types
export interface LikeDto {
	id: number;
	user: UserShortDto;
}

// Post types - Updated to include comments and likes
export interface Post {
	id: number;
	title: string;
	content: string;
	slug: string;
	authorId: number;
	blogId: number;
	comments: CommentDto[]; // Assuming post includes its comments
	likes: LikeDto[]; // Assuming post includes its likes
	// Add other post properties
}
