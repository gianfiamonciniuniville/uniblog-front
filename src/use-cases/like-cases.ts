// src/use-cases/like-cases.ts
import { post, remove } from "./api-client";
import type { LikeCreateDto, LikeDto } from "../types/api"; // Added 'type' keyword for imports

export const createLike = async (data: LikeCreateDto) => {
  try {
    const response = await post<LikeDto>("/Like", data);
    return response;
  } catch (error) {
    console.error("Error creating like:", error);
    throw error;
  }
};

export const deleteLike = async (id: number) => {
  try {
    const response = await remove<void>(`/Like/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting like with ID ${id}:`, error);
    throw error;
  }
};