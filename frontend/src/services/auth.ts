import type { User } from "@/types/user";
import { apiRequest } from "./api";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user: User;
}

export interface AuthError {
    success: false;
    error: string;
}

export const authService = {
    async signup(credentials: SignupCredentials): Promise<AuthResponse> {
        const response = await apiRequest<AuthResponse>(
            "POST",
            "/api/signup",
            credentials
        );

        if (response.success && response.user) {
            localStorage.setItem(
                "superCoolBroData",
                JSON.stringify(response.user)
            );
            // If your backend returns a token, store it too
            // localStorage.setItem('auth_token', response.token);
        }

        return response;
    },

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiRequest<AuthResponse>(
            "POST",
            "/api/login",
            credentials
        );

        if (response.success && response.user) {
            localStorage.setItem(
                "superCoolBroData",
                JSON.stringify(response.user)
            );
            // If your backend returns a token, store it too
            // localStorage.setItem('auth_token', response.token);
        }

        return response;
    },

    async logout(): Promise<void> {
        try {
            await apiRequest<void>("POST", "/api/logout");
        } finally {
            // Clear local storage regardless of API response
            localStorage.removeItem("superCoolBroData");
            localStorage.removeItem("auth_token");
        }
    },

    async getCurrentUser(): Promise<User> {
        return apiRequest<User>("GET", "/api/auth/me");
    },

    async refreshToken(): Promise<{ token: string }> {
        return apiRequest<{ token: string }>("POST", "/api/auth/refresh");
    },
};
