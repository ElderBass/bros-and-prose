import type { Book } from "@/types/books";
import { apiRequest } from "./api";

const currentBookId = "starter_villain_scalzi";

const pastBooksIds = ["eleven_twenty_two_sixty_three_king"];
const futureBooksIds = [] as string[];

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
        const pastBooks = response.data.filter((book) =>
            pastBooksIds.includes(book.id)
        );
        return pastBooks;
    },
    getFutureBooks: async () => {
        const response = await apiRequest<BooksResponse>("GET", "/api/books");
        const futureBooks = response.data.filter((book) =>
            futureBooksIds.includes(book.id)
        );
        return futureBooks;
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
