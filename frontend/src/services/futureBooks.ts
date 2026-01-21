import type {
    ArchivedBooksEntry,
    FutureBook,
    FutureBookSelectorRequest,
} from "@/types/books";
import { apiRequest } from "./api";

export interface FutureBooksResponse {
    success: boolean;
    message: string;
    data: FutureBook[];
}

export interface FutureBookResponse {
    success: boolean;
    message: string;
    data: FutureBook;
}

export interface ArchivedBooksResponse {
    success: boolean;
    message: string;
    data: ArchivedBooksEntry[];
}

export interface CurrentSelectorResponse {
    success: boolean;
    message: string;
    data: string;
}

export interface FutureBookMetadata {
    bookTitle: string;
    username: string;
}

export interface FutureBookRequest {
    selection: FutureBook;
    metadata: FutureBookMetadata;
}

export const futureBooksService = {
    getCurrentSelector: async () => {
        const response = await apiRequest<CurrentSelectorResponse>(
            "GET",
            "/api/futureBooks/currentSelector"
        );
        return response.data;
    },
    setCurrentSelector: async (selectorId: string) => {
        const response = await apiRequest<ArchivedBooksResponse>(
            "POST",
            "/api/futureBooks/setSelector",
            { selectorId } as FutureBookSelectorRequest
        );
        return response.data;
    },
    getCurrentSelections: async () => {
        const response = await apiRequest<FutureBooksResponse>(
            "GET",
            "/api/futureBooks/current"
        );
        return response.data;
    },
    addCurrentSelection: async (
        selection: FutureBook,
        metadata: FutureBookMetadata
    ) => {
        const response = await apiRequest<FutureBooksResponse>(
            "POST",
            "/api/futureBooks/current",
            { selection, metadata }
        );
        return response.data;
    },
    updateCurrentSelection: async (
        selection: FutureBook,
        metadata?: FutureBookMetadata
    ) => {
        const payload = metadata ? { selection, metadata } : selection;
        const response = await apiRequest<FutureBookResponse>(
            "PUT",
            `/api/futureBooks/current/${selection.id}`,
            payload
        );
        return response.data;
    },
    deleteCurrentSelection: async (selectionId: string) => {
        const response = await apiRequest<FutureBooksResponse>(
            "DELETE",
            `/api/futureBooks/current/${selectionId}`
        );
        return response.data;
    },
    getArchivedSelections: async () => {
        const response = await apiRequest<ArchivedBooksResponse>(
            "GET",
            "/api/futureBooks/archived"
        );
        return response.data;
    },
    archiveSelections: async (archiveEntry: ArchivedBooksEntry) => {
        const response = await apiRequest<ArchivedBooksResponse>(
            "POST",
            "/api/futureBooks/archived",
            archiveEntry
        );
        return response.data;
    },
};
