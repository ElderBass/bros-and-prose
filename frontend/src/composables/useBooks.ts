import { booksService } from "@/services";
import { useBooksStore } from "@/stores/books";

export const useBooks = () => {
    const booksStore = useBooksStore();

    const getCurrentBook = async () => {
        const book = await booksService.getCurrentBook();
        booksStore.setCurrentBook(book);
        return book;
    };

    const getAllBooks = async () => {
        const books = await booksService.getBooks();
        return books;
    };

    const getPastBooks = async () => {
        const books = await booksService.getPastBooks();
        booksStore.setPastBooks(books);
    };

    const getFutureBooks = async () => {
        const books = await booksService.getFutureBooks();
        booksStore.setFutureBooks(books);
    };

    return {
        getCurrentBook,
        getPastBooks,
        getFutureBooks,
        getAllBooks,
    };
};
