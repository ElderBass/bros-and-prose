import { useBooksStore } from "@/stores/books";
import type { FutureBook } from "@/types";

export const getUsersFutureBookVoteId = (userId: string) => {
    const booksStore = useBooksStore();
    return (
        booksStore.futureBooks.find((b) => b.votes.includes(userId))?.id || ""
    );
};

export const userHasVotedForBook = (bookId: string, userId: string) => {
    return getUsersFutureBookVoteId(userId) === bookId;
};

export const getMostVotedFutureBookId = (futureBooks: FutureBook[]) => {
    return futureBooks.reduce((max, book) =>
        book.votes.length > max.votes.length ? book : max
    ).id;
};
