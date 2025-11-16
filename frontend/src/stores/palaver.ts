import { defineStore } from "pinia";
import type { PalaverEntry, PalaverType } from "@/types/palaver";

export type PalaverFilter = "all" | PalaverType;
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
    filter: PalaverFilter;
    hasMore: boolean;
    modal: null | (PalaverModal & { open: boolean });
}

export const usePalaverStore = defineStore("palaver", {
    state: () => ({
        entries: [] as PalaverEntry[],
        filter: "all" as PalaverFilter,
        hasMore: true,
        modal: null as null | (PalaverModal & { open: boolean }),
    }),
    getters: {
        filtered(state) {
            if (state.filter === "all") return state.entries;
            return state.entries.filter((e) => e.type === state.filter);
        },
        itemModalOpen: (s) => s.modal?.open && s.modal.kind === "item",
        successModalOpen: (s) => s.modal?.open && s.modal.kind === "success",
        errorModalOpen: (s) => s.modal?.open && s.modal.kind === "error",
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
