import type { UserInfo } from "./user";
import type { Comment } from "./books";

export type PalaverType =
    | "discussion_note"
    | "progress_note"
    | "suggestion"
    | "recommendation"
    | "misc";

export interface ItemTypeButtonProp {
    type: PalaverType;
    label: string;
    title: string;
}

export interface Recommendation {
    title: string;
    author: string;
    tags: string[];
}

export interface PalaverEntry {
    id: string;
    type: PalaverType;
    text: string;
    createdAt: string;
    userInfo: UserInfo;
    bookInfo?: {
        title: string;
        id: string;
    };
    recommendation?: Recommendation;
    likes?: string[];
    dislikes?: string[];
    comments?: Comment[];
    updatedAt?: string;
}

export interface PalaverEntryMetadata {
    username: string;
    bookTitle?: string;
    targetUsername?: string;
    targetUserEmail?: string;
    updateType?: ReactionType | PalaverType;
}

export interface PalaverEntryRequest {
    entry: PalaverEntry;
    metadata: PalaverEntryMetadata;
}

export type ReactionType = "like" | "dislike" | "comment";
