import { defineStore } from "pinia";
import type { Book, BooksState } from "@/types";

export const useBooksStore = defineStore("books", {
    state: (): BooksState => ({
        currentBook: {} as Book,
        pastBooks: [] as Book[],
        mostVotedFutureBookId: "",
    }),
    getters: {
        getPastBooks: (state) => state.pastBooks,
        getCurrentBook: (state) => state.currentBook,
        getNonFutureBooks: (state) => [state.currentBook, ...state.pastBooks],
    },
    actions: {
        setCurrentBook(book: Book) {
            this.currentBook = book;
        },
        setPastBooks(books: Book[]) {
            this.pastBooks = books;
        },
        setMostVotedFutureBookId(id: string) {
            this.mostVotedFutureBookId = id;
        },
    },
});
