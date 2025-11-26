import { defineStore } from "pinia";
import type { PalaverEntry, PalaverType } from "@/types/palaver";
import { filterPalaverEntries } from "@/utils/palaverUtils";

export type PalaverFilter = PalaverType;
export type PalaverAction = "create" | "update" | "delete";
export type PalaverModalKind = "item" | "confirm-delete" | "success" | "error";

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
    entry: PalaverEntry;
}
export interface ConfirmDeleteModal {
    kind: "confirm-delete";
    entry: PalaverEntry;
}

export type PalaverModal =
    | PalaverSuccessModal
    | PalaverErrorModal
    | PalaverItemModal
    | ConfirmDeleteModal;

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
        confirmDeleteModalOpen: (s) =>
            s.modal?.open && s.modal.kind === "confirm-delete",
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
            const updatedEntries = entries.map((entry) => {
                return {
                    ...entry,
                    comments: Object.values(entry.comments || {}).sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                    ),
                };
            });
            this.entries = updatedEntries;
        },
        setHasUnreadEntries(hasUnread: boolean) {
            this.hasUnreadEntries = hasUnread;
        },
        prepend(entry: PalaverEntry) {
            this.entries = [entry, ...this.entries];
        },
        openItemModal(action: PalaverAction, entry = {} as PalaverEntry) {
            this.modal = { open: true, kind: "item", action, entry };
        },
        openConfirmDeleteModal(entry: PalaverEntry) {
            this.modal = {
                open: true,
                kind: "confirm-delete",
                entry,
            };
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
