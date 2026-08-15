import type { BookInfo } from "./books";
import type { UserInfo } from "./user";

export type PalaverType =
    | "discussion_note"
    | "progress_note"
    | "suggestion"
    | "recommendation"
    | "review"
    | "prose_prompt"
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
    reactions?: EmojiReactions;
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
    reactions?: EmojiReactions;
    comments?: Comment[];
    updatedAt?: string;
}

export interface PalaverEntryMetadata {
    username: string;
    bookTitle?: string;
    targetUsername?: string;
    targetUserEmail?: string;
    updateType?: ReactionType | PalaverType;
    reactionKey?: EmojiReactionKey;
    reactionEmoji?: string;
    replyToText?: string;
    mentionedUsers?: Array<{ username: string; email: string }>;
    ctaLabel?: string;
    ctaPath?: string;
}

export interface PalaverEntryRequest {
    entry: PalaverEntry;
    metadata: PalaverEntryMetadata;
}

export type ReactionType =
    | "like"
    | "dislike"
    | "reaction"
    | "comment"
    | "reply"
    | "favorite";

export type EmojiReactionKey =
    | "thumbs_up"
    | "thumbs_down"
    | "heart"
    | "laugh"
    | "eyes"
    | "fire";

export type EmojiReactions = Partial<Record<EmojiReactionKey, string[]>>;

export interface EmojiReactionOption {
    key: EmojiReactionKey;
    emoji: string;
    label: string;
}

export interface EmojiReactionBucket extends EmojiReactionOption {
    reactors: string[];
}
