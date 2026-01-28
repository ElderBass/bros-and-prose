import type { User } from "./user";

export interface Avatar {
    avatar: string;
    avatarType: "icon" | "image";
}

export interface AvatarRequest {
    avatar: File;
    avatarType: "icon" | "image";
}

export interface AvatarResponse {
    avatarUrl: string;
    user: User;
}
