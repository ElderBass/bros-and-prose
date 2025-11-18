import type { PalaverEntry, PalaverType } from "@/types";
import { v4 as uuidv4 } from "uuid";
import {
    getUserInfo,
    capitalizeAuthorName,
    capitalizeBookTitle,
    getLastUnreadPalaverEntry,
    setLastUnreadPalaverEntry,
} from "@/utils";
import { useUserStore } from "@/stores/user";
import { usePalaverStore } from "@/stores/palaver";

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
    const entry: PalaverEntry = {
        id: uuidv4(),
        type: type,
        text: text.trim(),
        createdAt: new Date().toISOString(),
        userInfo: getUserInfo(useUserStore().loggedInUser),
        bookInfo: type === "discussion_note" ? bookInfo : undefined,
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
