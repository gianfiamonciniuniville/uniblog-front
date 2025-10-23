import axios from "axios";
import type { IPostCreateDto, IPostDto, IPostUpdateDto } from "../types/post";

export const getPosts = async () => {
	try {
		const response = await axios.get<IPostDto[]>("/Post/all");
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const createPost = async (data: IPostCreateDto) => {
	try {
		const response = await axios.post<IPostDto>("/Post", data);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const getPostById = async (id: number) => {
	try {
		const response = await axios.get<IPostDto>(`/Post/${id}`);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const updatePost = async (id: number, data: IPostUpdateDto) => {
	try {
		const response = await axios.put<IPostDto>(`/Post/${id}`, data);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const publishPost = async (id: number) => {
	try {
		const response = await axios.post<IPostDto>(`/Post/${id}/publish`);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const getPostBySlug = async (slug: string) => {
	try {
		const response = await axios.get<IPostDto>(`/Post/slug/${slug}`);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const getPostsByAuthorId = async (authorId: number) => {
	try {
		const response = await axios.get<IPostDto[]>(`/Post/author/${authorId}`);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
