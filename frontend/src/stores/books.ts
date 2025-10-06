import { defineStore } from "pinia";
import type { Book, BooksState, FutureBook } from "@/types";

export const useBooksStore = defineStore("books", {
    state: (): BooksState => ({
        currentBook: {} as Book,
        pastBooks: [] as Book[],
        futureBooks: [],
    }),
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
    },
});
