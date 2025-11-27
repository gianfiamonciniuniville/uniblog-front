// src/use-cases/api-client.ts
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios"; // Added 'type' keyword for imports

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7147"; // TODO: Replace with actual backend URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface RequestOptions extends AxiosRequestConfig {
  token?: string; // This token will be handled by the interceptor, but keeping for consistency if needed for specific calls
}

async function apiClient<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axiosInstance(endpoint, options);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // You can add more sophisticated error handling here
      // e.g., check for 401 and redirect to login
      console.error("API call failed:", error.response?.data || error.message);
      return Promise.reject(error.response?.data || error.message);
    }
    console.error("An unexpected error occurred:", error);
    return Promise.reject("An unexpected error occurred");
  }
}

export const get = <T>(endpoint: string, customConfig?: RequestOptions) => {
  return apiClient<T>(endpoint, { method: "GET", ...customConfig });
};

export const post = <T>(endpoint: string, body: unknown, customConfig?: RequestOptions) => {
  return apiClient<T>(endpoint, { method: "POST", data: body, ...customConfig });
};

export const put = <T>(endpoint: string, body: unknown, customConfig?: RequestOptions) => {
  return apiClient<T>(endpoint, { method: "PUT", data: body, ...customConfig });
};

export const remove = <T>(endpoint: string, customConfig?: RequestOptions) => {
  return apiClient<T>(endpoint, { method: "DELETE", ...customConfig });
};
