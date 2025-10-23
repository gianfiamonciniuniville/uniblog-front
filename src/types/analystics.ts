import type { IUserShortDto } from "./user";

export interface ICommentDto {
	id: number;
	content: string;
	user: IUserShortDto;
}

export interface ILikeDto {
	id: number;
	user: IUserShortDto;
}

export interface IRegisterUserDto {
	userName: string;
	email: string;
	password: string;
}

export interface ILoginUserDto {
	email: string;
	password: string;
}

export interface IUpdateUserProfileDto {
	bio?: string;
	profileImageUrl?: string;
}

export interface IUserDto {
	id: number;
	userName: string;
	email: string;
	profileImageUrl?: string | null;
	bio?: string | null;
	role: string;
}

export interface IAuthResponseDto {
	token: string;
	user: IUserDto;
}
