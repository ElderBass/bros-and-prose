import { defineStore } from "pinia";
import type { BookshelfBook, Shelf } from "@/types";

export type ModalType =
    | "addBook"
    | "editBook"
    | "removeBook"
    | "moveBook"
    | "finishCurrentBook"
    | "bookActionSuccess"
    | "addBookError"
    | "review"
    | null;

export type BookActionType = "add" | "update" | "remove";

interface ModalState {
    modal: ModalType;
    selectedBook: BookshelfBook | null;
    selectedBookShelf: Shelf;
    moveTargetShelf: Shelf;
    message: string;
    bookActionType: BookActionType;
}

export const useShelfModalStore = defineStore("shelfModal", {
    state: (): ModalState => ({
        modal: null,
        selectedBook: null,
        selectedBookShelf: "haveRead",
        moveTargetShelf: "haveRead",
        message: "",
        bookActionType: "add",
    }),

    actions: {
        openModal(modalType: ModalType) {
            this.modal = modalType;
        },
        openAddBook(shelf?: Shelf) {
            this.modal = "addBook";
            this.selectedBookShelf = shelf || "haveRead";
        },
        openEditBook(book: BookshelfBook, shelf: Shelf) {
            this.modal = "editBook";
            this.selectedBook = book;
            this.selectedBookShelf = shelf;
        },
        openBookActionSuccess(
            action: BookActionType,
            book: BookshelfBook,
            shelf: Shelf,
            message: string
        ) {
            this.modal = "bookActionSuccess";
            this.selectedBook = book;
            this.selectedBookShelf = shelf;
            this.message = message;
            this.bookActionType = action;
        },
        openAddBookError(book: BookshelfBook, shelf: Shelf, message: string) {
            this.modal = "addBookError";
            this.selectedBook = book;
            this.selectedBookShelf = shelf;
            this.message = message;
        },
        openConfirmRemove(book: BookshelfBook, shelf: Shelf) {
            this.modal = "removeBook";
            this.selectedBook = book;
            this.selectedBookShelf = shelf;
        },
        openConfirmMove(book: BookshelfBook) {
            this.modal = "moveBook";
            this.selectedBook = book;
            this.moveTargetShelf = "haveRead";
        },
        openConfirmMoveTo(book: BookshelfBook, targetShelf: Shelf) {
            this.modal = "moveBook";
            this.selectedBook = book;
            this.moveTargetShelf = targetShelf;
        },
        openConfirmFinishCurrentBook(book: BookshelfBook) {
            this.modal = "finishCurrentBook";
            this.selectedBook = book;
        },
        openReview() {
            this.modal = "review";
        },
        closeModal() {
            this.modal = null;
            this.selectedBook = null;
            this.selectedBookShelf = "haveRead";
            this.moveTargetShelf = "haveRead";
            this.message = "";
            this.bookActionType = "add";
        },
    },

    getters: {
        isModalOpen: (state) => state.modal !== null,
        addBookModalOpen: (state) => state.modal === "addBook",
        editBookModalOpen: (state) => state.modal === "editBook",
        confirmRemoveModalOpen: (state) => state.modal === "removeBook",
        confirmMoveModalOpen: (state) => state.modal === "moveBook",
        confirmFinishCurrentBookModalOpen: (state) =>
            state.modal === "finishCurrentBook",
        bookActionSuccessModalOpen: (state) =>
            state.modal === "bookActionSuccess",
        addBookErrorModalOpen: (state) => state.modal === "addBookError",
        reviewModalOpen: (state) => state.modal === "review",
    },
});
