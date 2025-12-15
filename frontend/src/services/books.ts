import type { Book, GoogleBooksResult } from "@/types/books";
import { apiRequest } from "./api";

export const currentBookId = "mans_search_for_meaning_frankl";

export interface BookResponse {
    success: boolean;
    message: string;
    data: Book;
}

export interface BooksResponse {
    success: boolean;
    message: string;
    data: Book[];
}

export interface GoogleBooksResponse {
    success: boolean;
    message: string;
    data: GoogleBooksResult[];
}

export const booksService = {
    // FIREBASE ROUTES
    updateBook: async (book: Book, isCurrentBook = false) => {
        const url = isCurrentBook
            ? "/api/books/currentBook"
            : `/api/books/pastBooks/${book.id}`;
        const response = await apiRequest<BookResponse>("PUT", url, book);
        return response.data;
    },
    getCurrentBook: async () => {
        const response = await apiRequest<BookResponse>(
            "GET",
            "/api/books/currentBook"
        );
        return response.data;
    },
    updateCurrentBook: async (book: Book) => {
        const response = await apiRequest<BookResponse>(
            "PUT",
            "/api/books/currentBook",
            book
        );
        return response.data;
    },
    getPastBooks: async () => {
        const response = await apiRequest<BooksResponse>(
            "GET",
            "/api/books/pastBooks"
        );
        console.log("GET PAST BOOKS response in getPastBooks", response.data);
        const pastBooks: Book[] = response.data.sort(
            (a, b) =>
                new Date(a.dateCompleted || "").getTime() -
                new Date(b.dateCompleted || "").getTime()
        );
        return pastBooks;
    },

    getPastBook: async (bookId: string) => {
        const response = await apiRequest<BookResponse>(
            "GET",
            `/api/books/pastBooks/${bookId}`
        );
        return response.data;
    },
    // OPENLIBRARY ROUTES
    getBookByTitle: async (title: string) => {
        const response = await fetch(
            `https://openlibrary.org/search.json?title=${title}`
        );
        const data = await response.json();
        return data.docs;
    },
    searchBooksByTitle: async (title: string) => {
        const response = await fetch(
            `https://openlibrary.org/search.json?title=${title}`
        );
        const data = await response.json();
        return data.docs;
    },

    // GOOGLE BOOKS ROUTES
    searchGoogleByTitle: async (title: string) => {
        const response = await apiRequest<{ data: GoogleBooksResult[] }>(
            "POST",
            "/api/googleBooks/title",
            { title }
        );
        return response.data;
    },
};
