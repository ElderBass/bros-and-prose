import type { Comment } from "./palaver";
import type { UserInfo } from "./user";

export type ProseType = "creative" | "academic" | "poetic" | "misc";

export type ProseUpdateType =
    | "prose_created"
    | "prose_like"
    | "prose_dislike"
    | "prose_comment"
    | "prose_reply"
    | "prose_mention";

export interface ProseEntry {
    id: string;
    title: string;
    markdown: string;
    type: ProseType;
    createdAt: string;
    userInfo: UserInfo;
    excerpt?: string;
    context?: string;
    tags?: string[];
    likes?: string[];
    dislikes?: string[];
    favorites?: string[];
    comments?: Comment[];
    updatedAt?: string;
}

export interface ProseEntryMetadata {
    username: string;
    proseTitle: string;
    text?: string;
    targetUsername?: string;
    targetUserEmail?: string;
    updateType?: ProseUpdateType;
    replyToText?: string;
    mentionedUsers?: Array<{ username: string; email: string }>;
}

export interface ProseEntryRequest {
    entry: ProseEntry;
    metadata?: ProseEntryMetadata;
}

export interface ProseDraft {
    title: string;
    type: ProseType;
    context?: string;
    markdown: string;
    savedAt: string;
}
