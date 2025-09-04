import type { Review } from "./review";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    currentBookProgress: number;
    reviews: Review[];
}

export interface UserResponse {
    success: boolean;
    message: string;
    user: User;
}
