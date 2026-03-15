import type { ProseEntry, ProseType } from "@/types";
import {
    getLastUnreadProseEntry,
    setLastUnreadProseEntry,
} from "./localStorageUtils";

export type ProseTypeFilter = ProseType;

export const checkForUnreadProseEntries = (
    entries: ProseEntry[],
    setHasUnread: (value: boolean) => void
) => {
    if (!entries.length) return;
    const { entryId = "", date = "" } = getLastUnreadProseEntry();
    if (!entryId) {
        setLastUnreadProseEntry(entries[0].id, entries[0].createdAt);
        setHasUnread(true);
        return;
    }
    if (
        entries[0].id === entryId ||
        new Date(entries[0].createdAt).getTime() <= new Date(date).getTime()
    ) {
        return;
    }
    setLastUnreadProseEntry(entries[0].id, entries[0].createdAt);
    setHasUnread(true);
};

export const filterProseEntries = (
    entries: ProseEntry[],
    filters: ProseTypeFilter[],
    filteredBro: string
): ProseEntry[] => {
    if (filters.length === 0 && filteredBro === "") return entries;
    if (filters.length === 0) {
        return entries.filter((e) => e.userInfo.id === filteredBro);
    }
    if (filteredBro === "") {
        return entries.filter((e) => filters.includes(e.type));
    }
    return entries.filter(
        (e) => filters.includes(e.type) && e.userInfo.id === filteredBro
    );
};

export const getProseTypeColor = (type: ProseType): string => {
    switch (type) {
        case "creative":
            return "green";
        case "academic":
            return "lavender";
        case "poetic":
            return "pink";
        case "misc":
            return "yellow";
        default:
            return "blue";
    }
};
