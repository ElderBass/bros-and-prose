import { useBooksStore } from "@/stores/books";
import type { Book } from "@/types";

export const getBookByIdFromStore = (id: string) => {
    const booksStore = useBooksStore();
    const book = booksStore.getAllBooks.find((book: Book) => book.id === id);
    if (!book) {
        throw new Error(`Book not found in store: ${id}`);
    }
    return book;
};
