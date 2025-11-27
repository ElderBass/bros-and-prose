import { apiRequest } from "./api";
import type { PalaverEntry, PalaverEntryRequest } from "@/types";

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
    create: async ({ entry, metadata }: PalaverEntryRequest) =>
        apiRequest<PalaverEntryResponse>("POST", "/api/palaver", {
            entry,
            metadata,
        }),
    update: async ({ entry, metadata }: PalaverEntryRequest) =>
        apiRequest<PalaverEntryResponse>("PUT", `/api/palaver/${entry.id}`, {
            entry,
            metadata,
        }),
    delete: async (entryId: string) =>
        apiRequest<PalaverEntryResponse>("DELETE", `/api/palaver/${entryId}`),
};
