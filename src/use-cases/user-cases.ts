import axios from "axios";
import type {
	IAuthResponseDto,
	ILoginUserDto,
	IRegisterUserDto,
	IUpdateUserProfileDto,
	IUserDto,
} from "../types/analystics";

export const getUsers = async () => {
	try {
		const response = await axios.get<IUserDto[]>("/User/all");
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const getUserById = async (id: number) => {
	try {
		const response = await axios.get<IUserDto>(`/User/${id}`);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const registerUser = async (data: IRegisterUserDto) => {
	try {
		const response = await axios.post<IAuthResponseDto>("/User/register", data);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const loginUser = async (data: ILoginUserDto) => {
	try {
		const response = await axios.post<IAuthResponseDto>("/User/login", data);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const updateUserProfile = async (
	id: number,
	data: IUpdateUserProfileDto
) => {
	try {
		const response = await axios.put<IAuthResponseDto>(
			`/User/profile/${id}`,
			data
		);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
