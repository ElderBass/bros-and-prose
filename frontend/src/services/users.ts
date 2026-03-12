import type {
    ApiResponse,
    ProgressUpdateMetadata,
    ShelfAddMetadata,
    User,
} from "@/types";
import { apiRequest } from "./api";
import { mockUsers } from "@/data/mockUsers";

export const usersService = {
    getUser: async (userId: string) => {
        try {
            const response = await apiRequest<ApiResponse<User>>(
                "GET",
                `/api/users/id/${userId}`
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    getUserByUsername: async (username: string) => {
        try {
            const response = await apiRequest<ApiResponse<User>>(
                "GET",
                `/api/users/username/${username}`
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    getUsers: async (shouldMock: boolean = false) => {
        try {
            if (shouldMock) {
                return mockUsers;
            }
            const response = await apiRequest<ApiResponse<User[]>>(
                "GET",
                `/api/users/all`
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    updateUser: async (
        userId: string,
        user: User,
        metadata?: ShelfAddMetadata | ProgressUpdateMetadata
    ) => {
        try {
            const payload = metadata ? { ...user, metadata } : user;
            const response = await apiRequest<ApiResponse<User>>(
                "PUT",
                `/api/users/id/${userId}`,
                payload
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};
