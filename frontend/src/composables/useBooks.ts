import { ref, onValue, off, type DataSnapshot } from "firebase/database";
import { getFirebase } from "@/setup/firebaseClient";
import { booksService } from "@/services";
import { useBooksStore } from "@/stores/books";
import type { Book, Comment, FutureBook, OpenLibraryBookResult } from "@/types";
import { useLog } from "./useLog";
import { getUsersFutureBookVoteId } from "@/utils";

let unsubscribe: (() => void) | null = null;

export function subscribeToFutureBooks() {
    if (unsubscribe) return; // already listening
    const { db } = getFirebase();
    const futureBooksRef = ref(db, "books/futureBooks");

    const handler = (snapshot: DataSnapshot) => {
        const value = snapshot.val() ?? {};
        const list = Object.values(value).filter(
            (book: unknown) => (book as Book).id
        );
        useBooksStore().setFutureBooks(list as FutureBook[]);
    };

    onValue(futureBooksRef, handler, (error) => {
        console.error("KERTWANGING error in subscribeToFutureBooks", error);
    });
    unsubscribe = () => off(futureBooksRef, "value", handler);
}

export function unsubscribeFromFutureBooks() {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
}

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

    const getFutureBooks = async (isInit = false) => {
        const books = await booksService.getFutureBooks();
        booksStore.setFutureBooks(books);
        if (isInit) {
            subscribeToFutureBooks();
        }
        return books;
    };

    const addFutureBook = async (futureBook: FutureBook) => {
        const book = await booksService.addFutureBook(futureBook);
        await info(`Added future book: ${book.title}`);
        booksStore.setFutureBooks([...booksStore.futureBooks, book]);
        return book;
    };

    const updateFutureBook = async (bookId: string, futureBook: FutureBook) => {
        const book = await booksService.updateFutureBook(bookId, futureBook);
        await info(`Updated future book: ${book.title}`);
        booksStore.setFutureBooks(
            booksStore.futureBooks.map((b) => (b.id === bookId ? book : b))
        );
        return book;
    };

    const voteForFutureBook = async (bookId: string, userId: string) => {
        const book = booksStore.futureBooks.find((b) => b.id === bookId);
        const voteId = getUsersFutureBookVoteId(userId);
        if (!book) {
            await useLog().error(`Future book not found: ${bookId}`);
            return;
        }
        const hasVotedForCurrentBook = voteId === bookId;
        if (!hasVotedForCurrentBook) {
            await removeVoteForFutureBook(voteId, userId);
        }
        const updatedVotes = hasVotedForCurrentBook
            ? book.votes.filter((v) => v !== userId)
            : [...book.votes, userId];
        const updatedBook = await updateFutureBook(bookId, {
            ...book,
            votes: updatedVotes,
        });
        return updatedBook;
    };

    const removeVoteForFutureBook = async (bookId: string, userId: string) => {
        const book = booksStore.futureBooks.find((b) => b.id === bookId);
        if (!book) {
            await useLog().error(`Future book not found: ${bookId}`);
            return;
        }
        const votes = book.votes.filter((v) => v !== userId);
        await updateFutureBook(bookId, { ...book, votes });
    };

    const deleteFutureBook = async (bookId: string) => {
        const updatedFutureBooks = await booksService.deleteFutureBook(bookId);
        await info(`Deleted future book: ${bookId}`);
        booksStore.setFutureBooks(updatedFutureBooks);
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
        updateFutureBook,
        voteForFutureBook,
        deleteFutureBook,
        getAllBooks,
        getBookByTitle,
        searchBooksByTitle,
        updateBook,
        addDiscussionComment,
    };
};
