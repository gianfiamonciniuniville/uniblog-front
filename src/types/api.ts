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
	role: string;
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
}

export interface CommentDto {
	id: number;
	content: string;
	postId: number;
	user: UserShortDto;
}

export interface LikeDto {
	id: number;
	user: UserShortDto;
}

export interface Post {
	id: number;
	title: string;
	content: string;
	slug: string;
	authorId: number;
	blogId: number;
	comments: CommentDto[];
	likes: LikeDto[];
}
