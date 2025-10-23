import axios from "axios";
import type { ICommentDto } from "../types/analystics";

export const postComment = async (data: ICommentDto) => {
	try {
		const response = await axios.post("/Comment", data);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const deleteComment = async (id: number) => {
	try {
		const response = await axios.delete(`/Comment/${id}`);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const postLike = async (data: ICommentDto) => {
	try {
		const response = await axios.post("/Like", data);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const deleteLike = async (id: number) => {
	try {
		const response = await axios.delete(`/Like/${id}`);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
