import axios from "axios";
import type { IBlogCreateDto, IBlogDto, IBlogUpdateDto } from "../types/blog";

export const getBlogCases = async () => {
	try {
		const response = await axios.get("/Blog/all");

		return response.data as IBlogDto[];
	} catch (error) {
		console.log(error);
	}
};

export const getBlogCaseById = async (id: number) => {
	try {
		const response = await axios.get(`/Blog/${id}`);
		return response.data as IBlogDto;
	} catch (error) {
		console.log(error);
	}
};

export const updateBlogCase = async (id: number, data: IBlogUpdateDto) => {
	try {
		const response = await axios.put(`/Blog/${id}`, data);
		return response.data as IBlogDto;
	} catch (error) {
		console.log(error);
	}
};

export const deleteBlogCase = async (id: number) => {
	try {
		const response = await axios.delete(`/Blog/${id}`);
		return response.data as IBlogDto;
	} catch (error) {
		console.log(error);
	}
};

export const createBlogCase = async (data: IBlogCreateDto) => {
	try {
		const response = await axios.post("/Blog", data);
		return response.data as IBlogDto;
	} catch (error) {
		console.log(error);
	}
};
