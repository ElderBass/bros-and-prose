import { defineStore } from "pinia";
import type { FutureBook } from "@/types";

export type ModalType =
    | "addBook"
    | "editBook"
    | "deleteBook"
    | "moveBook"
    | "addBookSuccess"
    | "addBookError"
    | null;

interface ModalState {
    modal: ModalType;
    bookTitle: string;
    shelfDisplayName: string;
    message: string;
    selectedBook: FutureBook | null;
    selectedBookShelf: "wantToRead" | "haveRead" | null;
}

export const useShelfModalStore = defineStore("shelfModal", {
    state: (): ModalState => ({
        modal: null,
        bookTitle: "",
        shelfDisplayName: "",
        message: "",
        selectedBook: null,
        selectedBookShelf: null,
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
            bookTitle: string,
            shelfDisplayName: string,
            message: string
        ) {
            this.modal = "addBookSuccess";
            this.bookTitle = bookTitle;
            this.shelfDisplayName = shelfDisplayName;
            this.message = message;
        },
        openAddBookError(
            bookTitle: string,
            shelfDisplayName: string,
            message: string
        ) {
            this.modal = "addBookError";
            this.bookTitle = bookTitle;
            this.shelfDisplayName = shelfDisplayName;
            this.message = message;
        },
        openConfirmDelete(book: FutureBook, shelf: "wantToRead" | "haveRead") {
            this.modal = "deleteBook";
            this.bookTitle = book.title;
            this.selectedBook = book;
            this.selectedBookShelf = shelf;
        },
        openConfirmMove(book: FutureBook) {
            this.modal = "moveBook";
            this.selectedBook = book;
        },
        closeModal() {
            this.modal = null;
            this.bookTitle = "";
            this.shelfDisplayName = "";
            this.message = "";
            this.selectedBook = null;
            this.selectedBookShelf = null;
        },
    },

    getters: {
        isModalOpen: (state) => state.modal !== null,
        addBookModalOpen: (state) => state.modal === "addBook",
        editBookModalOpen: (state) => state.modal === "editBook",
        confirmDeleteModalOpen: (state) => state.modal === "deleteBook",
        confirmMoveModalOpen: (state) => state.modal === "moveBook",
        addBookSuccessModalOpen: (state) => state.modal === "addBookSuccess",
        addBookErrorModalOpen: (state) => state.modal === "addBookError",
    },
});
