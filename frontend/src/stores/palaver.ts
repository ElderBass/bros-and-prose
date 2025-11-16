import { defineStore } from "pinia";
import type { PalaverEntry, PalaverType } from "@/types/palaver";

export type PalaverFilter = "all" | PalaverType;

export interface PalaverState {
    entries: PalaverEntry[];
    filter: PalaverFilter;
    hasMore: boolean;
}

export const usePalaverStore = defineStore("palaver", {
    state: () => ({
        entries: [] as PalaverEntry[],
        filter: "all" as PalaverFilter,
        hasMore: true,
    }),
    getters: {
        filtered(state) {
            if (state.filter === "all") return state.entries;
            return state.entries.filter((e) => e.type === state.filter);
        },
    },
    actions: {
        setFilter(f: PalaverFilter) {
            this.filter = f;
        },
        setEntries(list: PalaverEntry[]) {
            this.entries = list.sort((a, b) =>
                b.createdAt.localeCompare(a.createdAt)
            );
        },
        prepend(entry: PalaverEntry) {
            this.entries = [entry, ...this.entries];
        },
    },
});
