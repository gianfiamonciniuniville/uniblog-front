import type { IPostDto } from "./post";
import type { IUserShortDto } from "./user";

export interface IBlogDto {
	Id: number;
	Title: string;
	Description: string;
	User: IUserShortDto;
	Posts: IPostDto[];
}

export interface IBlogCreateDto {
	Title: string;
	Description: string;
	UserId: number;
}

export interface IBlogUpdateDto {
	Title: string;
	Description: string;
}
