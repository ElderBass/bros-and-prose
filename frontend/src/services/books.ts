import type { Book, GoogleBooksResult, BookshelfBook } from "@/types/books";
import { apiRequest } from "./api";
import { v4 as uuidv4 } from "uuid";

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

    // FAVORITES SEARCH
    searchGoogleBooksForFavorites: async (
        query: string
    ): Promise<BookshelfBook[]> => {
        try {
            const response = await apiRequest<{ data: GoogleBooksResult[] }>(
                "POST",
                "/api/googleBooks/title",
                { title: query }
            );

            // Transform Google Books results to BookshelfBook format
            return response.data.map(transformGoogleBookToBookshelfBook);
        } catch (error) {
            console.error("Error searching Google Books", error);
            throw new Error("Failed to search Google Books. Please try again.");
        }
    },
};

// Transform Google Books API response to BookshelfBook format
const transformGoogleBookToBookshelfBook = (
    googleBook: GoogleBooksResult
): BookshelfBook => {
    const volumeInfo = googleBook.volumeInfo || {};

    return {
        id: googleBook.id || uuidv4(),
        title: volumeInfo.title || "Unknown Title",
        author: volumeInfo.authors?.[0] || "Unknown Author",
        yearPublished: volumeInfo.publishedDate
            ? new Date(volumeInfo.publishedDate).getFullYear()
            : new Date().getFullYear(),
        pages: volumeInfo.pageCount || 0,
        imageSrc:
            volumeInfo.imageLinks?.thumbnail ||
            volumeInfo.imageLinks?.smallThumbnail ||
            "",
        description: volumeInfo.description || "",
        tags: [],
    };
};
