import type {
    BookInfo,
    BookshelfBook,
    Comment,
    PalaverEntry,
    PalaverType,
    ReactionType,
    Review,
} from "@/types";
import { v4 as uuidv4 } from "uuid";
import {
    getUserInfo,
    capitalizeAuthorName,
    capitalizeBookTitle,
    getLastUnreadPalaverEntry,
    setLastUnreadPalaverEntry,
    maybeShowCurrentBookReview,
} from "@/utils";
import { useUserStore } from "@/stores/user";
import { usePalaverStore, type PalaverFilter } from "@/stores/palaver";

export const buildPalaverEntry = ({
    type,
    text,
    bookInfo = {} as BookInfo,
    recTitle = "",
    recAuthor = "",
    tags = [],
}: {
    type: PalaverType;
    text: string;
    bookInfo?: BookInfo;
    recTitle?: string;
    recAuthor?: string;
    tags?: string[];
}) => {
    const bookInfoValue =
        type === "discussion_note" || type === "progress_note"
            ? bookInfo
            : undefined;
    const entry: PalaverEntry = {
        id: uuidv4(),
        type: type,
        text: text.trim(),
        createdAt: new Date().toISOString(),
        userInfo: getUserInfo(useUserStore().loggedInUser),
        bookInfo: bookInfoValue,
        recommendation:
            type === "recommendation"
                ? {
                      title: capitalizeBookTitle(recTitle.trim()),
                      author: capitalizeAuthorName(recAuthor.trim()),
                      tags,
                  }
                : undefined,
    };
    return entry;
};

export const buildPalaverEntryFromReview = (review: Review): PalaverEntry => {
    const user = useUserStore().loggedInUser;

    return {
        id: uuidv4(),
        type: "review",
        text: review.reviewComment,
        bookInfo: {
            ...review.book,
        },
        rating: review.rating,
        createdAt: new Date().toISOString(),
        userInfo: getUserInfo(user),
        likes: [],
        dislikes: [],
        comments: [],
    };
};

export const buildPalaverComment = (
    commentText: string,
    replyTo?: {
        commentId: string;
        username: string;
        text: string;
    }
): Comment => {
    const user = useUserStore().loggedInUser;

    return {
        id: uuidv4(),
        userInfo: getUserInfo(user),
        text: commentText,
        createdAt: new Date().toISOString(),
        ...(replyTo && {
            replyToId: replyTo.commentId,
            replyToUsername: replyTo.username,
            replyToText: replyTo.text.substring(0, 100), // Truncate for preview
        }),
    };
};

export const checkForUnreadEntries = (entries: PalaverEntry[]) => {
    const { entryId = "", date = "" } = getLastUnreadPalaverEntry();

    if (!entryId) {
        setLastUnreadPalaverEntry(entries[0].id, entries[0].createdAt);
        usePalaverStore().setHasUnreadEntries(true);
        return;
    }

    if (
        entries[0].id === entryId ||
        new Date(entries[0].createdAt).getTime() < new Date(date).getTime()
    ) {
        return;
    }

    setLastUnreadPalaverEntry(entries[0].id, entries[0].createdAt);
    usePalaverStore().setHasUnreadEntries(true);
};

export const filterPalaverEntries = (
    entries: PalaverEntry[],
    filters: PalaverFilter[],
    filteredBro: string
) => {
    if (filters.length === 0 && filteredBro === "") return entries;
    if (filters.length === 0)
        return entries.filter((e) => e.userInfo.id === filteredBro);
    if (filteredBro === "")
        return entries.filter((e) => filters.includes(e.type as PalaverFilter));
    return entries.filter(
        (e) =>
            filters.includes(e.type as PalaverFilter) &&
            e.userInfo.id === filteredBro &&
            maybeShowCurrentBookReview(e)
    );
};

export const buildPalaverEntryMetadata = (entry: PalaverEntry) => {
    switch (entry.type) {
        case "discussion_note":
            return {
                bookTitle: entry.bookInfo?.title ?? "",
                username: entry.userInfo.username,
                text: entry.text,
            };
        case "recommendation":
            return {
                bookTitle: entry.recommendation?.title ?? "",
                username: entry.userInfo.username,
                text: entry.text,
            };
        case "review":
            return {
                bookTitle: entry.bookInfo?.title ?? "",
                username: entry.userInfo.username,
                text: `Score: ${entry.rating} / 10. Comment: ${entry.text}`,
            };
        case "suggestion":
        case "progress_note":
        case "misc":
        default:
            return { username: entry.userInfo.username, text: entry.text };
    }
};

export const buildPalaverReactionMetadata = (
    item: PalaverEntry | Comment,
    reactionType: ReactionType
) => {
    const loggedInUsername = useUserStore().loggedInUser.username;
    return {
        username: loggedInUsername,
        targetUsername: item.userInfo.username,
        targetUserEmail: item.userInfo.email,
        updateType: reactionType,
        text: reactionType === "comment" ? item.text : undefined,
    };
};

export const buildReplyMetadata = (reply: Comment, entry: PalaverEntry) => {
    const loggedInUsername = useUserStore().loggedInUser.username;
    const { replyToId, replyToUsername, replyToText, text } = reply;

    // Find the original comment being replied to in the entry's comments
    const originalComment = entry.comments?.find((c) => c.id === replyToId);

    return {
        username: loggedInUsername,
        targetUsername: replyToUsername || "unknown",
        targetUserEmail: originalComment?.userInfo.email || "",
        updateType: "reply" as ReactionType,
        text,
        replyToText,
    };
};

export const sortPalaverStuff = (stuff: PalaverEntry[] | Comment[]) => {
    return stuff.sort((a, b) => {
        return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });
};

export const getPalaverCommentsForBook = (bookId: string) => {
    return sortPalaverStuff(
        usePalaverStore().entries.filter((e) => e.bookInfo?.id === bookId)
    );
};

export const getReactions = (
    reaction: ReactionType,
    item: PalaverEntry | Comment
): string[] => {
    return reaction === "like" ? item.likes || [] : item.dislikes || [];
};

export const updatePalaverLikesDislikes = (
    item: PalaverEntry | Comment,
    action: "like" | "dislike"
) => {
    const loggedInUsername = useUserStore().loggedInUser.username;

    if (action === "like") {
        item.likes = [...(item.likes || []), loggedInUsername];
        item.dislikes = item.dislikes?.filter((d) => d !== loggedInUsername);
    } else {
        item.dislikes = [...(item.dislikes || []), loggedInUsername];
        item.likes = item.likes?.filter((l) => l !== loggedInUsername);
    }
    return item;
};

export const getUserContent = (userId: string) => {
    return usePalaverStore().entries.filter((e) => e.userInfo.id === userId);
};

export const isUnsumbittedRecommendation = (entry: PalaverEntry) => {
    return (
        entry.type === "recommendation" &&
        entry?.recommendation?.title &&
        entry?.recommendation?.author &&
        !entry?.id
    );
};

export const buildRecommendationFromBookshelfBook = (
    book: BookshelfBook
): PalaverEntry => {
    return {
        id: "",
        type: "recommendation",
        bookInfo: buildBookInfoFromBookshelfBook(book),
        recommendation: {
            title: book.title,
            author: book.author,
            tags: book.tags,
        },
        text: book.description,
        createdAt: new Date().toISOString(),
        userInfo: getUserInfo(useUserStore().loggedInUser),
        likes: [],
        dislikes: [],
        comments: [],
    };
};

export const buildBookInfoFromBookshelfBook = (
    book: BookshelfBook
): BookInfo => {
    return {
        id: book.id,
        title: book.title,
        author: book.author,
    };
};

export const getRecommendationForBook = (bookId: string) => {
    return usePalaverStore().entries.find(
        (e) => e.type === "recommendation" && e.bookInfo?.id === bookId
    );
};
