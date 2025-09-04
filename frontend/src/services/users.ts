import type { ApiResponse, User } from "@/types";
import { apiRequest } from "./api";

export const usersService = {
    getUser: async (userId: string) => {
        try {
            const response = await apiRequest<ApiResponse<User>>(
                "GET",
                `/api/users/${userId}`
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    getUsers: async () => {
        try {
            const response = await apiRequest<ApiResponse<User[]>>(
                "GET",
                `/api/users`
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    updateUser: async (userId: string, user: User) => {
        try {
            const response = await apiRequest<ApiResponse<User>>(
                "PUT",
                `/api/users/${userId}`,
                user
            );
            console.log("\n UPDATE USER response", response, "\n");
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};
