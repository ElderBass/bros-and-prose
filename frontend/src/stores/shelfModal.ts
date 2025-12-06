import { defineStore } from "pinia";

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
}

export const useShelfModalStore = defineStore("shelfModal", {
    state: (): ModalState => ({
        modal: null,
        bookTitle: "",
        shelfDisplayName: "",
        message: "",
    }),

    actions: {
        openModal(modalType: ModalType) {
            this.modal = modalType;
        },
        openAddBook() {
            this.modal = "addBook";
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
        closeModal() {
            this.modal = null;
            this.bookTitle = "";
            this.shelfDisplayName = "";
            this.message = "";
        },
    },

    getters: {
        isModalOpen: (state) => state.modal !== null,
        addBookModalOpen: (state) => state.modal === "addBook",
        addBookSuccessModalOpen: (state) => state.modal === "addBookSuccess",
        addBookErrorModalOpen: (state) => state.modal === "addBookError",
    },
});
