import type { ICommentDto, ILikeDto } from "./analystics";
import type { IUserShortDto } from "./user";

export interface IPostDto {
	Id: number;
	Title: string;
	Content: string;
	Slug: string;
	Published: boolean;
	PublishedAt: Date;
	Author: IUserShortDto;
	Comments: ICommentDto[];
	Likes: ILikeDto[];
}

export interface IPostCreateDto {
	Title: string;
	Content: string;
	Slug: string;
	AuthorId: number;
	BlogId: number;
}

export interface IPostUpdateDto {
	Title: string;
	Content: string;
	Slug: string;
}
