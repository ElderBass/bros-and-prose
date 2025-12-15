import type {
    BookInfo,
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

export const buildPalaverComment = (commentText: string): Comment => {
    const user = useUserStore().loggedInUser;

    return {
        id: uuidv4(),
        userInfo: getUserInfo(user),
        comment: commentText,
        createdAt: new Date().toISOString(),
    };
};

export const checkForUnreadEntries = (entries: PalaverEntry[]) => {
    const { entryId, date } = getLastUnreadPalaverEntry();

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
            e.userInfo.id === filteredBro
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
    };
};

export const sortPalaverStuff = (stuff: PalaverEntry[] | Comment[]) => {
    return stuff.sort((a, b) => {
        const bDate = b.updatedAt
            ? new Date(b.updatedAt)
            : new Date(b.createdAt);
        const aDate = a.updatedAt
            ? new Date(a.updatedAt)
            : new Date(a.createdAt);
        return bDate.getTime() - aDate.getTime();
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
