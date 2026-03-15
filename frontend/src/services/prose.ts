import { apiRequest } from "./api";
import type { ProseEntry, ProseEntryRequest } from "@/types";

export interface ProseEntryResponse {
    success: boolean;
    message: string;
    data: ProseEntry;
}

export interface ProseEntriesResponse {
    success: boolean;
    message: string;
    data: ProseEntry[];
}

export const proseService = {
    list: async (): Promise<ProseEntriesResponse> =>
        apiRequest("GET", "/api/prose"),
    get: async (entryId: string): Promise<ProseEntryResponse> =>
        apiRequest<ProseEntryResponse>("GET", `/api/prose/${entryId}`),
    create: async ({ entry, metadata }: ProseEntryRequest) =>
        apiRequest<ProseEntryResponse>("POST", "/api/prose", {
            entry,
            metadata,
        }),
    update: async ({ entry, metadata }: ProseEntryRequest) =>
        apiRequest<ProseEntryResponse>("PUT", `/api/prose/${entry.id}`, {
            entry,
            metadata,
        }),
    delete: async (entryId: string) =>
        apiRequest<ProseEntryResponse>("DELETE", `/api/prose/${entryId}`),
};
