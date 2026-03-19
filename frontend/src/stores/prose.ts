import { defineStore } from "pinia";
import type { ProseEntry } from "@/types";
import { filterProseEntries, type ProseTypeFilter } from "@/utils/proseUtils";

export interface ProseState {
    entries: ProseEntry[];
    filters: ProseTypeFilter[];
    filteredBro: string;
    hasUnreadProseEntries: boolean;
}

export const useProseStore = defineStore("prose", {
    state: (): ProseState => ({
        entries: [],
        filters: [],
        filteredBro: "",
        hasUnreadProseEntries: false,
    }),
    getters: {
        filteredEntries(state) {
            if (state.filters.length === 0 && state.filteredBro === "") {
                return state.entries;
            }
            return filterProseEntries(
                state.entries,
                state.filters,
                state.filteredBro
            );
        },
        activeFilterLabel(state): string {
            if (state.filters.length === 0 && !state.filteredBro) return "all";
            if (state.filteredBro && state.filters.length === 0)
                return "from this bro";
            if (state.filters.length === 1) return state.filters[0];
            return state.filters.join(", ");
        },
    },
    actions: {
        setEntries(entries: ProseEntry[]) {
            this.entries = entries;
        },
        addFilter(filter: ProseTypeFilter) {
            if (!this.filters.includes(filter)) {
                this.filters.push(filter);
            }
        },
        removeFilter(filter: ProseTypeFilter) {
            this.filters = this.filters.filter((f) => f !== filter);
        },
        clearFilters() {
            this.filters = [];
            this.filteredBro = "";
        },
        setFilteredBro(bro: string) {
            this.filteredBro = bro;
        },
        setHasUnreadProseEntries(hasUnread: boolean) {
            this.hasUnreadProseEntries = hasUnread;
        },
        clearEntries() {
            this.entries = [];
        },
    },
});
