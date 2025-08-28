import { defineStore } from "pinia";
import type { Book, BooksState } from "@/types";

export const useBooksStore = defineStore("books", {
    state: (): BooksState => ({
        currentBook: null,
        pastBooks: [],
        futureBooks: [],
    }),
    actions: {
        setCurrentBook(book: Book) {
            this.currentBook = book;
        },
        setPastBooks(books: Book[]) {
            this.pastBooks = books;
        },
        setFutureBooks(books: Book[]) {
            this.futureBooks = books;
        },
    },
});
