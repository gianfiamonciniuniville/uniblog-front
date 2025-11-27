import { get, post, put } from "./api-client";
import type {
	AuthResponseDto,
	LoginUserDto,
	RegisterUserDto,
	UpdateUserProfileDto,
	UserDto,
} from "../types/api";

export const getUsers = async () => {
	try {
		const response = await get<UserDto[]>("/User/all");
		return response;
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
};

export const getUserById = async (id: number) => {
	try {
		const response = await get<UserDto>(`/User/${id}`);
		return response;
	} catch (error) {
		console.error(`Error fetching user with ID ${id}:`, error);
		throw error;
	}
};

export const registerUser = async (data: RegisterUserDto) => {
	try {
		const response = await post<AuthResponseDto>("/User/register", data);
		return response;
	} catch (error) {
		console.error("Error registering user:", error);
		throw error;
	}
};

export const loginUser = async (data: LoginUserDto) => {
	try {
		const response = await post<AuthResponseDto>("/User/login", data);
		return response;
	} catch (error) {
		console.error("Error logging in user:", error);
		throw error;
	}
};

export const updateUserProfile = async (
	id: number,
	data: UpdateUserProfileDto
) => {
	try {
		const response = await put<AuthResponseDto>(
			`/User/profile/${id}`,
			data
		);
		return response;
	} catch (error) {
		console.error(`Error updating user profile for ID ${id}:`, error);
		throw error;
	}
};