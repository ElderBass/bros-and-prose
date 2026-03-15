import type { ProseEntry, ProseType } from "@/types";

export type ProseTypeFilter = ProseType;

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
