import { defineStore } from "pinia";
import type { ArchivedBooksEntry, FutureBook } from "@/types/books";
import type { User } from "@/types";

export type FutureBookAction = "create" | "update" | "delete";
export type FutureBookModalStatus = "success" | "error";

export interface FutureBookFormModal {
    kind: "form";
    action: FutureBookAction;
    futureBook: FutureBook | null;
}

export interface FutureBookResultModal {
    kind: "result";
    action: FutureBookAction;
    status: FutureBookModalStatus;
    message: string[];
}

export type FutureBookModal = FutureBookFormModal | FutureBookResultModal;

export const useFutureBooksStore = defineStore("futureBooks", {
    state: () => ({
        currentSelections: [] as FutureBook[],
        archivedSelections: [] as ArchivedBooksEntry[],
        currentSelector: {} as User,
        mostVotedFutureBookId: "",
        modal: null as null | (FutureBookModal & { open: boolean }),
    }),
    getters: {
        getCurrentSelections: (state) => state.currentSelections,
        getArchivedSelections: (state) =>
            state.archivedSelections.sort(
                (a, b) =>
                    new Date(b.archivedAt).getTime() -
                    new Date(a.archivedAt).getTime()
            ),
        getCurrentSelector: (state) => state.currentSelector,
        modalOpen: (state) => !!state.modal?.open,
        formModal: (state) =>
            state.modal?.kind === "form" && state.modal.open
                ? state.modal
                : null,
        resultModal: (state) =>
            state.modal?.kind === "result" && state.modal.open
                ? state.modal
                : null,
        formModalOpen: (state) =>
            !!(state.modal?.open && state.modal.kind === "form"),
        resultModalOpen: (state) =>
            !!(state.modal?.open && state.modal.kind === "result"),
    },
    actions: {
        setCurrentSelections(selections: FutureBook[]) {
            this.currentSelections = selections;
        },
        addCurrentSelection(selection: FutureBook) {
            this.currentSelections.push(selection);
        },
        updateCurrentSelection(selection: FutureBook) {
            this.currentSelections = this.currentSelections.map((s) =>
                s.id === selection.id ? selection : s
            );
        },
        deleteCurrentSelection(selectionId: string) {
            this.currentSelections = this.currentSelections.filter(
                (s) => s.id !== selectionId
            );
        },
        setArchivedSelections(selections: ArchivedBooksEntry[]) {
            this.archivedSelections = selections;
        },
        setCurrentSelector(selector: User) {
            this.currentSelector = selector;
        },
        clearCurrentSelections() {
            this.currentSelections = [];
        },
        setMostVotedFutureBookId(id: string) {
            this.mostVotedFutureBookId = id;
        },
        openFormModal(futureBook?: FutureBook, action?: FutureBookAction) {
            this.modal = {
                open: true,
                kind: "form",
                action: action || (futureBook ? "update" : "create"),
                futureBook: futureBook ?? null,
            };
        },
        openResultModal(payload: {
            action: FutureBookAction;
            status: FutureBookModalStatus;
            message: string[];
        }) {
            this.modal = {
                open: true,
                kind: "result",
                action: payload.action,
                status: payload.status,
                message: payload.message,
            };
        },
        closeModal() {
            this.modal = null;
        },
    },
});
