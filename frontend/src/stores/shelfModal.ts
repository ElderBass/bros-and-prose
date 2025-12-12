import { defineStore } from "pinia";
import type { FutureBook, Shelf } from "@/types";

export type ModalType =
    | "addBook"
    | "editBook"
    | "removeBook"
    | "moveBook"
    | "addBookSuccess"
    | "addBookError"
    | "review"
    | null;

interface ModalState {
    modal: ModalType;
    selectedBook: FutureBook | null;
    selectedBookShelf: Shelf;
    message: string;
}

export const useShelfModalStore = defineStore("shelfModal", {
    state: (): ModalState => ({
        modal: null,
        selectedBook: null,
        selectedBookShelf: "haveRead",
        message: "",
    }),

    actions: {
        openModal(modalType: ModalType) {
            this.modal = modalType;
        },
        openAddBook(shelf?: Shelf) {
            this.modal = "addBook";
            this.selectedBookShelf = shelf || "haveRead";
        },
        openEditBook(book: FutureBook, shelf: Shelf) {
            this.modal = "editBook";
            this.selectedBook = book;
            this.selectedBookShelf = shelf;
        },
        openAddBookSuccess(book: FutureBook, shelf: Shelf, message: string) {
            this.modal = "addBookSuccess";
            this.selectedBook = book;
            this.selectedBookShelf = shelf;
            this.message = message;
        },
        openAddBookError(book: FutureBook, shelf: Shelf, message: string) {
            this.modal = "addBookError";
            this.selectedBook = book;
            this.selectedBookShelf = shelf;
            this.message = message;
        },
        openConfirmRemove(book: FutureBook, shelf: Shelf) {
            this.modal = "removeBook";
            this.selectedBook = book;
            this.selectedBookShelf = shelf;
        },
        openConfirmMove(book: FutureBook) {
            this.modal = "moveBook";
            this.selectedBook = book;
        },
        openReview() {
            this.modal = "review";
        },
        closeModal() {
            this.modal = null;
            this.selectedBook = null;
            this.selectedBookShelf = "haveRead";
            this.message = "";
        },
    },

    getters: {
        isModalOpen: (state) => state.modal !== null,
        addBookModalOpen: (state) => state.modal === "addBook",
        editBookModalOpen: (state) => state.modal === "editBook",
        confirmRemoveModalOpen: (state) => state.modal === "removeBook",
        confirmMoveModalOpen: (state) => state.modal === "moveBook",
        addBookSuccessModalOpen: (state) => state.modal === "addBookSuccess",
        addBookErrorModalOpen: (state) => state.modal === "addBookError",
        reviewModalOpen: (state) => state.modal === "review",
    },
});
