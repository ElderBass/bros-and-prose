import axios from "axios";
import type { LoginCredentials, SignupCredentials } from "./auth";
import type { Review, User } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 second timeout
});

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export const apiRequest = async <T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data?: SignupCredentials | LoginCredentials | User | Review
): Promise<T> => {
    try {
        const response = await apiClient({
            method,
            url,
            data,
        });
        return response.data;
    } catch (error) {
        // Error is already handled by interceptor
        throw error;
    }
};
