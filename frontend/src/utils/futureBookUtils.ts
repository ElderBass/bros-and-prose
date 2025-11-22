import { useFutureBooksStore } from "@/stores/futureBooks";
import type { FutureBook } from "@/types";

export const getUsersFutureBookVoteId = (userId: string) => {
    const futureBooksStore = useFutureBooksStore();
    return (
        futureBooksStore.currentSelections.find((b) => b.votes.includes(userId))
            ?.id || ""
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
