import { apiClient, apiRequest } from "./api";
import type { AvatarResponse, User } from "@/types";

/**
 * Upload avatar image to backend
 */
export const uploadAvatarImage = async (
    userId: string,
    file: File
): Promise<AvatarResponse> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await apiClient.post(
        `/api/users/id/${userId}/avatar`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data.data;
};

/**
 * Update user's avatar to an icon
 */
export const updateUserAvatarIcon = async (
    userId: string,
    iconName: string
): Promise<User> => {
    const updatedUser = await apiRequest<User>(
        "PUT",
        `/api/users/id/${userId}`,
        {
            avatar: iconName,
            avatarType: "icon",
        }
    );
    return updatedUser;
};
