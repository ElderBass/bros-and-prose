import { useBooksStore } from "@/stores/books";

export const getUsersFutureBookVoteId = (userId: string) => {
    const booksStore = useBooksStore();
    return (
        booksStore.futureBooks.find((b) => b.votes.includes(userId))?.id || ""
    );
};

export const userHasVotedForBook = (bookId: string, userId: string) => {
    return getUsersFutureBookVoteId(userId) === bookId;
};
