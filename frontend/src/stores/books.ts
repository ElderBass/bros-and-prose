import { defineStore } from "pinia";
import type {
    Book,
    BooksState,
    FutureBook,
    FutureBookModal,
    FutureBookResultModal,
} from "@/types";

export const initialFutureBookModal: FutureBookModal = {
    show: false,
    futureBook: {} as FutureBook,
};
export const initialFutureBookResultModal: FutureBookResultModal = {
    show: false,
    type: "success",
    message: [],
};

export const useBooksStore = defineStore("books", {
    state: (): BooksState => ({
        currentBook: {} as Book,
        pastBooks: [] as Book[],
        futureBooks: [],
        mostVotedFutureBookId: "",
        futureBookModal: {
            show: false,
            futureBook: {} as FutureBook,
        },
        futureBookResultModal: {
            show: false,
            type: "success",
            message: [],
        },
    }),
    getters: {
        getPastBooks: (state) => state.pastBooks,
        getCurrentBook: (state) => state.currentBook,
        getNonFutureBooks: (state) => [state.currentBook, ...state.pastBooks],
        getFutureBooks: (state) => state.futureBooks,
        getFutureBookModal: (state) => state.futureBookModal,
        getFutureBookResultModal: (state) => state.futureBookResultModal,
    },
    actions: {
        setCurrentBook(book: Book) {
            this.currentBook = book;
        },
        setPastBooks(books: Book[]) {
            this.pastBooks = books;
        },
        setFutureBooks(futureBooks: FutureBook[]) {
            this.futureBooks = futureBooks;
        },
        setMostVotedFutureBookId(id: string) {
            this.mostVotedFutureBookId = id;
        },
        setFutureBookModal(modal: FutureBookModal) {
            this.futureBookModal = modal;
        },
        clearFutureBookModal() {
            this.futureBookModal = initialFutureBookModal;
        },
        setFutureBookResultModal(modal: FutureBookResultModal) {
            this.futureBookResultModal = modal;
        },
        clearFutureBookResultModal() {
            this.futureBookResultModal = initialFutureBookResultModal;
        },
    },
});
