import { booksService } from "@/services";
import { useBooksStore } from "@/stores/books";
import type { Book, Comment, FutureBook, OpenLibraryBookResult } from "@/types";
import { useLog } from "./useLog";

export const useBooks = () => {
    const booksStore = useBooksStore();
    const { info } = useLog();

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

    const addFutureBook = async (futureBook: FutureBook) => {
        const book = await booksService.addFutureBook(futureBook);
        await info(`Added future book: ${book.title}`);
        booksStore.setFutureBooks([...booksStore.futureBooks, book]);
        return book;
    };

    const getBookByTitle = async (title: string) => {
        const book = await booksService.getBookByTitle(title);
        return book;
    };

    const searchBooksByTitle = async (title: string) => {
        const books: OpenLibraryBookResult[] =
            await booksService.searchBooksByTitle(title);
        const booksString = books
            .map(
                (book) =>
                    `title: ${book.title}, author: ${book.author_name ? book.author_name[0] : "unknown"}`
            )
            .join(", ");
        await info(`Received books in searchBooksByTitle: ${booksString}`);
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
        booksStore.setPastBooks(
            booksStore.pastBooks.map((b) =>
                b.id === book.id ? updatedBook : b
            )
        );
        return updatedBook;
    };

    return {
        getCurrentBook,
        getPastBook,
        getPastBooks,
        getFutureBooks,
        addFutureBook,
        getAllBooks,
        getBookByTitle,
        searchBooksByTitle,
        updateBook,
        addDiscussionComment,
    };
};
