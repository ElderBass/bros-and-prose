import { apiRequest } from "./api";
import type { PalaverEntry } from "@/types";

export interface PalaverEntryResponse {
    success: boolean;
    message: string;
    data: PalaverEntry;
}

export interface PalaverEntriesResponse {
    success: boolean;
    message: string;
    data: PalaverEntry[];
}

export const palaverService = {
    list: async (): Promise<PalaverEntriesResponse> =>
        apiRequest("GET", "/api/palaver"),
    create: async (entry: PalaverEntry) =>
        apiRequest<PalaverEntryResponse>("POST", "/api/palaver", entry),
    update: async (entry: PalaverEntry) =>
        apiRequest<PalaverEntryResponse>(
            "PUT",
            `/api/palaver/${entry.id}`,
            entry
        ),
    delete: async (entryId: string) =>
        apiRequest<PalaverEntryResponse>("DELETE", `/api/palaver/${entryId}`),
};
