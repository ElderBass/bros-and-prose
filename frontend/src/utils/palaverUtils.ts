import type { PalaverEntry, PalaverType } from "@/types";
import { v4 as uuidv4 } from "uuid";
import {
    getUserInfo,
    capitalizeAuthorName,
    capitalizeBookTitle,
} from "@/utils";
import { useUserStore } from "@/stores/user";

export const buildPalaverEntry = ({
    type,
    text,
    bookId,
    recTitle,
    recAuthor,
    tags,
}: {
    type: PalaverType;
    text: string;
    bookId: string;
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
        bookId: type === "discussion_note" ? bookId : undefined,
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
