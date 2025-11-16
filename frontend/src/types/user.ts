import type {
    IconPathData,
    IconPrefix,
    IconName,
} from "@fortawesome/fontawesome-svg-core";
import type { Review } from "./review";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    currentBookProgress: number;
    avatar: string;
    reviews: {
        [key: string]: Review;
    };
}

export interface UserInfo {
    id: string;
    username: string;
    email: string;
    avatar: string;
}

export interface UserResponse {
    success: boolean;
    message: string;
    user: User;
}

export type AvatarProp = {
    icon: [number, number, string[], string, IconPathData];
    prefix: IconPrefix;
    iconName: IconName;
};
