import type { PalaverEntry, PalaverType, ReactionType } from "@/types";
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
    bookInfo,
    recTitle,
    recAuthor,
    tags,
}: {
    type: PalaverType;
    text: string;
    bookInfo: {
        title: string;
        id: string;
    };
    recTitle: string;
    recAuthor: string;
    tags: string[];
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
            };
        case "recommendation":
            return {
                bookTitle: entry.recommendation?.title ?? "",
                username: entry.userInfo.username,
            };
        case "suggestion":
        case "progress_note":
        case "misc":
        default:
            return { username: entry.userInfo.username };
    }
};

export const buildPalaverReactionMetadata = (
    entry: PalaverEntry,
    reactionType: ReactionType
) => {
    const loggedInUsername = useUserStore().loggedInUser.username;
    return {
        username: loggedInUsername,
        targetUsername: entry.userInfo.username,
        targetUserEmail: entry.userInfo.email,
        updateType: reactionType,
    };
};
