import { useFutureBooksStore } from "@/stores/futureBooks";
import type { FutureBook, ArchivedBooksEntry } from "@/types";

export const getUsersFutureBookVoteId = (userId: string) => {
    const futureBooksStore = useFutureBooksStore();
    return (
        futureBooksStore.currentSelections.find((b) =>
            b.votes?.includes(userId)
        )?.id || ""
    );
};

export const userHasVotedForBook = (bookId: string, userId: string) => {
    return getUsersFutureBookVoteId(userId) === bookId;
};

export const getMostVotedFutureBookId = (futureBooks: FutureBook[]) => {
    return sanitizeFutureBookVotes(futureBooks).reduce((max, book) =>
        book.votes?.length > max.votes?.length ? book : max
    ).id;
};

export const sanitizeFutureBookVotes = (futureBooks: FutureBook[]) => {
    return futureBooks.map((book) => ({
        ...book,
        votes: book.votes?.filter((vote) => vote !== "placeholder") || [],
    }));
};

export const buildArchiveEntry = (
    futureBooks: FutureBook[],
    selectorId: string
): ArchivedBooksEntry => {
    return {
        selectorId,
        archivedBooks: futureBooks,
        archivedAt: new Date().toISOString(),
    };
};

export const getBookInfoFromFutureBook = (futureBook: FutureBook) => {
    return {
        title: futureBook.title,
        author: futureBook.author,
        tags: futureBook.tags,
    };
};
