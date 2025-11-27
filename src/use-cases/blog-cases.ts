// src/use-cases/blog-cases.ts
import { get, post, put, remove } from "./api-client";
import type { Blog, BlogCreateDto, BlogUpdateDto } from "../types/api"; // Added 'type' keyword for imports

export const getAllBlogs = async () => {
  try {
    const response = await get<Blog[]>("/Blog/all");
    return response;
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    throw error;
  }
};

export const getBlogById = async (id: number) => {
  try {
    const response = await get<Blog>(`/Blog/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching blog with ID ${id}:`, error);
    throw error;
  }
};

export const createBlog = async (data: BlogCreateDto) => {
  try {
    const response = await post<Blog>("/Blog", data);
    return response;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

export const updateBlog = async (id: number, data: BlogUpdateDto) => {
  try {
    const response = await put<Blog>(`/Blog/${id}`, data);
    return response;
  } catch (error) {
    console.error(`Error updating blog with ID ${id}:`, error);
    throw error;
  }
};

export const deleteBlog = async (id: number) => {
  try {
    const response = await remove<void>(`/Blog/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting blog with ID ${id}:`, error);
    throw error;
  }
};
