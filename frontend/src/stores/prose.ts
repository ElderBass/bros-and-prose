import { defineStore } from "pinia";
import type { ProseEntry, ProseType } from "@/types";

export type ProseFilter = ProseType | "all";

export interface ProseState {
    entries: ProseEntry[];
    selectedFilter: ProseFilter;
}

export const useProseStore = defineStore("prose", {
    state: (): ProseState => ({
        entries: [],
        selectedFilter: "all",
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
    },
    actions: {
        setEntries(entries: ProseEntry[]) {
            this.entries = entries;
        },
        setFilter(filter: ProseFilter) {
            this.selectedFilter = filter;
        },
        clearEntries() {
            this.entries = [];
        },
    },
});
