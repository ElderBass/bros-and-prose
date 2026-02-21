import type { BookInfo } from "./books";
import type { UserInfo } from "./user";

export type PalaverType =
    | "discussion_note"
    | "progress_note"
    | "suggestion"
    | "recommendation"
    | "review"
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

export interface Comment {
    id: string;
    userInfo: UserInfo;
    text: string;
    createdAt: string;
    updatedAt?: string;
    likes?: string[];
    dislikes?: string[];
    // Reply fields
    replyToId?: string;
    replyToUsername?: string;
    replyToText?: string;
}

export interface PalaverEntry {
    id: string;
    type: PalaverType;
    text: string;
    createdAt: string;
    userInfo: UserInfo;
    bookInfo?: BookInfo;
    rating?: number;
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
    replyToText?: string;
}

export interface PalaverEntryRequest {
    entry: PalaverEntry;
    metadata: PalaverEntryMetadata;
}

export type ReactionType = "like" | "dislike" | "comment" | "reply";
