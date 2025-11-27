// src/use-cases/comment-cases.ts
import { post, remove } from "./api-client";
import type { CommentCreateDto, CommentDto } from "../types/api"; // Added 'type' keyword for imports

export const createComment = async (data: CommentCreateDto) => {
  try {
    const response = await post<CommentDto>("/Comment", data);
    return response;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const deleteComment = async (id: number) => {
  try {
    const response = await remove<void>(`/Comment/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting comment with ID ${id}:`, error);
    throw error;
  }
};