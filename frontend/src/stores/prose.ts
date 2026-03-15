import { defineStore } from "pinia";
import type { ProseEntry, ProseType } from "@/types";

export type ProseFilter = ProseType | "all";

export interface ProseState {
    entries: ProseEntry[];
    selectedFilter: ProseFilter;
    savedProseIds: string[];
}

export const useProseStore = defineStore("prose", {
    state: (): ProseState => ({
        entries: [],
        selectedFilter: "all",
        savedProseIds: [],
    }),
    getters: {
        filteredEntries: (state) => {
            if (state.selectedFilter === "all") {
                return state.entries;
            }
            return state.entries.filter(
                (entry) => entry.type === state.selectedFilter
            );
        },
        isSaved: (state) => (proseId: string) => {
            return state.savedProseIds.includes(proseId);
        },
        getComments: (state) => (proseId: string) => {
            return (
                state.entries.find((entry) => entry.id === proseId)?.comments ||
                []
            );
        },
    },
    actions: {
        setEntries(entries: ProseEntry[]) {
            this.entries = entries;
        },
        setFilter(filter: ProseFilter) {
            this.selectedFilter = filter;
        },
        setSavedProseIds(ids: string[]) {
            this.savedProseIds = ids;
        },
        clearSavedProseIds() {
            this.savedProseIds = [];
        },
        clearEntries() {
            this.entries = [];
        },
    },
});
