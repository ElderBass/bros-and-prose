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
