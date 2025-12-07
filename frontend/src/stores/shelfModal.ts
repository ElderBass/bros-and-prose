import { defineStore } from "pinia";
import type { FutureBook } from "@/types";

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
    selectedBookShelf: "wantToRead" | "haveRead" | null;
    message: string;
}

export const useShelfModalStore = defineStore("shelfModal", {
    state: (): ModalState => ({
        modal: null,
        selectedBook: null,
        selectedBookShelf: null,
        message: "",
    }),

    actions: {
        openModal(modalType: ModalType) {
            this.modal = modalType;
        },
        openAddBook() {
            this.modal = "addBook";
        },
        openEditBook(book: FutureBook, shelf: "wantToRead" | "haveRead") {
            this.modal = "editBook";
            this.selectedBook = book;
            this.selectedBookShelf = shelf;
        },
        openAddBookSuccess(
            book: FutureBook,
            shelf: "wantToRead" | "haveRead",
            message: string
        ) {
            this.modal = "addBookSuccess";
            this.selectedBook = book;
            this.selectedBookShelf = shelf;
            this.message = message;
        },
        openAddBookError(
            book: FutureBook,
            shelf: "wantToRead" | "haveRead",
            message: string
        ) {
            this.modal = "addBookError";
            this.selectedBook = book;
            this.selectedBookShelf = shelf;
            this.message = message;
        },
        openConfirmRemove(book: FutureBook, shelf: "wantToRead" | "haveRead") {
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
            this.selectedBookShelf = null;
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
