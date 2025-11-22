import type { Book } from "@/types/books";
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

export const booksService = {
    getBook: async (bookId: string) => {
        const response = await apiRequest<BookResponse>(
            "GET",
            `/api/books/${bookId}`
        );
        return response.data;
    },
    getBooks: async () => {
        const response = await apiRequest<BooksResponse>("GET", "/api/books");
        return response.data;
    },
    getCurrentBook: async () => {
        const response = await apiRequest<BookResponse>(
            "GET",
            `/api/books/${currentBookId}`
        );
        return response.data;
    },
    getPastBooks: async () => {
        const response = await apiRequest<BooksResponse>("GET", "/api/books");
        const pastBooks = response.data.filter((book) => book.completed);
        return pastBooks;
    },
    updateBook: async (bookId: string, book: Book) => {
        const response = await apiRequest<BookResponse>(
            "PUT",
            `/api/books/${bookId}`,
            book
        );
        return response.data;
    },
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
};

// export const booksService = {
//     getCurrentBook: async () => {
//         const response = await fetch(
//             `https://openlibrary.org/search.json?title=${currentBook}`
//         );
//         const data = await response.json();
//         return data.docs[0];
//     },
//     searchByTitle: async (title: string) => {
//         const response = await fetch(
//             `https://openlibrary.org/search.json?title=${title}`
//         );
//         const data = await response.json();
//         return data.docs[0];
//     },
//     getPastBooks: async () => {
//         const response = await fetch(
//             `https://openlibrary.org/search.json?title=${pastBooks.join(",")}`
//         );
//         const data = await response.json();
//         return data.docs;
//     },
//     getBookImage: async (coverI: number) => {
//         const url = await `https://covers.openlibrary.org/b/id/${coverI}-M.jpg`;
//         return url;
//     },
//     getFutureBooks: async () => {
//         const response = await fetch(
//             `https://openlibrary.org/search.json?title=${futureBooks.join(",")}`
//         );
//         const data = await response.json();
//         return data.docs;
//     },
// };
