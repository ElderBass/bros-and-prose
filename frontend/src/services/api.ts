import axios from "axios";

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
        message: string,
        public data?: any
    ) {
        super(message);
        this.name = "ApiError";
    }
}

// apiClient.interceptors.request.use(
//     (config) => {
//         // Add auth token if available
//         const token = localStorage.getItem("auth_token");
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export const apiRequest = async <T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data?: any,
    config?: any
): Promise<T> => {
    try {
        const response = await apiClient({
            method,
            url,
            data,
            ...config,
        });
        return response.data;
    } catch (error) {
        // Error is already handled by interceptor
        throw error;
    }
};
