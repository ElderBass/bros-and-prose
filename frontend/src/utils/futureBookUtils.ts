import { useFutureBooksStore } from "@/stores/futureBooks";
import type { FutureBook, ArchivedBooksEntry } from "@/types";
import { useUserStore } from "@/stores/user";

export const getUsersFutureBookVoteId = (userId: string) => {
    const futureBooksStore = useFutureBooksStore();
    return (
        futureBooksStore.currentSelections.find((b) =>
            b.votes?.includes(userId)
        )?.id || ""
    );
};

export const getUsernamesFromIds = (userIds: string[]): string[] => {
    const allUsers = useUserStore().allUsers;
    return allUsers
        .filter((user) => userIds.includes(user.id))
        .map((user) => user.username);
};

export const userHasVotedForBook = (bookId: string, userId: string) => {
    return getUsersFutureBookVoteId(userId) === bookId;
};

const getMaxNumber = (numbers: number[]) => {
    return numbers.reduce((max, number) => (number > max ? number : max), 0);
};

export const getMostVotedFutureBookId = (futureBooks: FutureBook[]) => {
    const santizedVotes = sanitizeFutureBookVotes(futureBooks);
    const maxVoteCount = getMaxNumber(
        santizedVotes.map((book) => book.votes?.length || 0)
    );

    const highestBook = sanitizeFutureBookVotes(futureBooks).reduce(
        (max, book) => (book.votes?.length > max.votes?.length ? book : max)
    );

    if (highestBook.votes?.length > maxVoteCount) {
        return highestBook.id;
    }

    return "";
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

export const buildFutureBookUpdateMetadata = (
    book: FutureBook,
    updateType: "vote" | "unvote" | "mark_read" | "unmark_read"
): { updateType: string; bookTitle: string; username: string } => {
    const username = useUserStore().loggedInUser.username;

    const updateTypeMap = {
        vote: "future_book_voted",
        unvote: "future_book_unvoted",
        mark_read: "future_book_marked_read",
        unmark_read: "future_book_unmarked_read",
    };

    return {
        updateType: updateTypeMap[updateType],
        bookTitle: book.title,
        username,
    };
};

/**
 * Check if a user has marked a book as already read
 * @param book - The future book to check
 * @param userId - The user ID to check
 * @returns True if the user has marked the book as read
 */
export const hasUserMarkedAsRead = (
    book: FutureBook,
    userId: string
): boolean => {
    return book.alreadyRead?.includes(userId) ?? false;
};
