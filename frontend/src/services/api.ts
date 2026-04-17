import axios from "axios";
import type { LoginCredentials, SignupCredentials } from "./auth";
import type {
    Avatar,
    Review,
    User,
    Book,
    Log,
    FutureBook,
    ArchivedBooksEntry,
    FutureBookSelectorRequest,
    PalaverEntryRequest,
    ProseEntryRequest,
    AvatarRequest,
} from "@/types";
import type { FutureBookRequest } from "./futureBooks";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 60000, // 60 second timeout
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

export interface UserPatchRequest {
    updates: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}

export const apiRequest = async <T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    url: string,
    data?:
        | SignupCredentials
        | LoginCredentials
        | User
        | Review
        | Book
        | { log: Log }
        | FutureBook
        | PalaverEntryRequest
        | ProseEntryRequest
        | ArchivedBooksEntry
        | FutureBookSelectorRequest
        | FutureBookRequest
        | Avatar
        | AvatarRequest
        | UserPatchRequest
        | { title: string }
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
