import { booksService } from "@/services";
import { useBooksStore } from "@/stores/books";
import type { Book, Comment, OpenLibraryBookResult } from "@/types";
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
        const currentBook = await booksService.getCurrentBook();
        const pastBooks = await booksService.getPastBooks();
        const books = [currentBook, ...pastBooks];
        booksStore.setCurrentBook(currentBook);
        booksStore.setPastBooks(pastBooks);
        return books;
    };

    const getPastBook = async (bookId: string) => {
        const book = await booksService.getPastBook(bookId);
        return book;
    };

    const getPastBooks = async () => {
        const books = await booksService.getPastBooks();
        booksStore.setPastBooks(books);
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

    const updateBook = async (book: Book) => {
        const isCurrentBook = book.id === booksStore.currentBook.id;
        const updatedBook = await booksService.updateBook(book, isCurrentBook);
        updateBookStore(updatedBook, isCurrentBook);
        return updatedBook;
    };

    const addDiscussionComment = async (book: Book, comment: Comment) => {
        const isCurrentBook = book.id === booksStore.currentBook.id;
        let updatedBook = {
            ...book,
            discussionComments: {
                ...book.discussionComments,
                [comment.id]: comment,
            },
        };
        updatedBook = await booksService.updateBook(updatedBook, isCurrentBook);
        updateBookStore(updatedBook, isCurrentBook);
        return updatedBook;
    };

    const updateBookStore = (updatedBook: Book, isCurrentBook: boolean) => {
        if (isCurrentBook) {
            booksStore.setCurrentBook(updatedBook);
        } else {
            booksStore.setPastBooks(
                booksStore.pastBooks.map((b) =>
                    b.id === updatedBook.id ? updatedBook : b
                )
            );
        }
    };

    return {
        getCurrentBook,
        getPastBook,
        getPastBooks,
        getAllBooks,
        getBookByTitle,
        searchBooksByTitle,
        updateBook,
        addDiscussionComment,
    };
};
