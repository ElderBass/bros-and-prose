import { defineStore } from "pinia";
import type { ArchivedBooksEntry, FutureBook } from "@/types/books";
import type { User } from "@/types";

export const useFutureBooksStore = defineStore("futureBooks", {
    state: () => ({
        currentSelections: [] as FutureBook[],
        archivedSelections: [] as ArchivedBooksEntry[],
        currentSelector: {} as User,
        mostVotedFutureBookId: "",
    }),
    getters: {
        getCurrentSelections: (state) => state.currentSelections,
        getArchivedSelections: (state) => state.archivedSelections,
        getCurrentSelector: (state) => state.currentSelector,
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
    },
});
