import type { Comment } from "./palaver";
import type { UserInfo } from "./user";

export type ProseType = "creative" | "academic" | "poetic" | "misc";

export type ProseReactionType = "like" | "dislike" | "comment" | "reply";

export interface ProseEntry {
    id: string;
    title: string;
    markdown: string;
    type: ProseType;
    createdAt: string;
    userInfo: UserInfo;
    excerpt?: string;
    tags?: string[];
    likes?: string[];
    dislikes?: string[];
    comments?: Comment[];
    updatedAt?: string;
}

export interface ProseEntryMetadata {
    username: string;
    proseTitle: string;
    targetUsername?: string;
    targetUserEmail?: string;
    updateType?: ProseReactionType | "prose_created";
    replyToText?: string;
    mentionedUsers?: Array<{ username: string; email: string }>;
}

export interface ProseEntryRequest {
    entry: ProseEntry;
    metadata?: ProseEntryMetadata;
}
