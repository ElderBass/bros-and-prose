import { defineStore } from "pinia";
import type { PalaverEntry, PalaverType } from "@/types/palaver";
import { filterPalaverEntries } from "@/utils/palaverUtils";

export type PalaverFilter = PalaverType;
export type PalaverAction = "create" | "update" | "delete";
export type PalaverModalKind = "item" | "success" | "error";
export interface PalaverSuccessModal {
    kind: "success";
    itemType: PalaverType;
    action: PalaverAction;
}
export interface PalaverErrorModal {
    kind: "error";
    action: PalaverAction;
    errorMessage: string;
}
export interface PalaverItemModal {
    kind: "item";
    action: PalaverAction;
}
export type PalaverModal =
    | PalaverSuccessModal
    | PalaverErrorModal
    | PalaverItemModal;

export interface PalaverState {
    entries: PalaverEntry[];
    filters: PalaverFilter[];
    filteredBro: string;
    hasMore: boolean;
    modal: null | (PalaverModal & { open: boolean });
    hasUnreadEntries: boolean;
}

export const usePalaverStore = defineStore("palaver", {
    state: () => ({
        entries: [] as PalaverEntry[],
        filters: [] as PalaverFilter[],
        filteredBro: "",
        hasMore: true,
        modal: null as null | (PalaverModal & { open: boolean }),
        hasUnreadEntries: false,
    }),
    getters: {
        filtered(state) {
            if (state.filters.length === 0 && state.filteredBro === "") {
                return state.entries;
            }
            return filterPalaverEntries(
                state.entries,
                state.filters,
                state.filteredBro
            );
        },
        itemModalOpen: (s) => s.modal?.open && s.modal.kind === "item",
        successModalOpen: (s) => s.modal?.open && s.modal.kind === "success",
        errorModalOpen: (s) => s.modal?.open && s.modal.kind === "error",
    },
    actions: {
        addFilter(filter: PalaverFilter) {
            this.filters.push(filter);
        },
        removeFilter(filter: PalaverFilter) {
            this.filters = this.filters.filter((f) => f !== filter);
        },
        clearFilters() {
            this.filters = [];
            this.filteredBro = "";
        },
        setFilteredBro(bro: string) {
            this.filteredBro = bro;
        },
        setEntries(entries: PalaverEntry[]) {
            this.entries = entries;
        },
        setHasUnreadEntries(hasUnread: boolean) {
            this.hasUnreadEntries = hasUnread;
        },
        prepend(entry: PalaverEntry) {
            this.entries = [entry, ...this.entries];
        },
        openItemModal(action: PalaverAction) {
            this.modal = { open: true, kind: "item", action };
        },
        openSuccessModal(itemType: PalaverType, action: PalaverAction) {
            this.modal = {
                open: true,
                kind: "success",
                itemType,
                action,
            };
        },
        openErrorModal(errorMessage: string, action: PalaverAction) {
            this.modal = { open: true, kind: "error", action, errorMessage };
        },
        closeModal() {
            this.modal = null;
        },
    },
});
