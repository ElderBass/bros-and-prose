import { booksService } from "@/services";
import { useBooksStore } from "@/stores/books";
import type { Book, Comment } from "@/types";

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

    const getPastBook = async (bookId: string) => {
        const book = await booksService.getBook(bookId);
        return book;
    };

    const getPastBooks = async () => {
        const books = await booksService.getPastBooks();
        booksStore.setPastBooks(books);
    };

    const getFutureBooks = async () => {
        const books = await booksService.getFutureBooks();
        booksStore.setFutureBooks(books);
    };

    const getBookByTitle = async (title: string) => {
        const book = await booksService.getBookByTitle(title);
        return book;
    };

    const searchBooksByTitle = async (title: string) => {
        const books = await booksService.searchBooksByTitle(title);
        return books;
    };

    const updateBook = async (bookId: string, book: Book) => {
        const updatedBook = await booksService.updateBook(bookId, book);
        return updatedBook;
    };

    const addDiscussionComment = async (book: Book, comment: Comment) => {
        let updatedBook = {
            ...book,
            discussionComments: {
                ...book.discussionComments,
                [comment.id]: comment,
            },
        };
        updatedBook = await booksService.updateBook(book.id, updatedBook);
        return updatedBook;
    };

    return {
        getCurrentBook,
        getPastBook,
        getPastBooks,
        getFutureBooks,
        getAllBooks,
        getBookByTitle,
        searchBooksByTitle,
        updateBook,
        addDiscussionComment,
    };
};
