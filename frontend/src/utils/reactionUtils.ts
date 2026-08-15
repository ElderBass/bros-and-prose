import { EMOJI_REACTIONS } from "@/constants";
import type {
    Comment,
    EmojiReactionBucket,
    EmojiReactionKey,
    EmojiReactions,
    PalaverEntry,
    ProseEntry,
} from "@/types";

type ReactableItem = PalaverEntry | ProseEntry | Comment;
type ReactionSource = Pick<ReactableItem, "likes" | "dislikes" | "reactions">;

const LEGACY_REACTION_KEY_MAP: Partial<
    Record<EmojiReactionKey, "likes" | "dislikes">
> = {
    thumbs_up: "likes",
    thumbs_down: "dislikes",
};

export const getUniqueUsernames = (users: string[] = []) => {
    return Array.from(new Set(users.filter(Boolean)));
};

export const getEmojiReactionOption = (reactionKey: EmojiReactionKey) => {
    return EMOJI_REACTIONS.find((reaction) => reaction.key === reactionKey);
};

const getLegacyReactors = (
    item: ReactionSource,
    reactionKey: EmojiReactionKey
) => {
    const legacyField = LEGACY_REACTION_KEY_MAP[reactionKey];
    return legacyField ? item[legacyField] || [] : [];
};

export const normalizeEmojiReactions = (
    item: ReactionSource
): EmojiReactions => {
    return EMOJI_REACTIONS.reduce<EmojiReactions>((acc, reaction) => {
        const reactors = getUniqueUsernames([
            ...(item.reactions?.[reaction.key] || []),
            ...getLegacyReactors(item, reaction.key),
        ]);

        if (reactors.length > 0) {
            acc[reaction.key] = reactors;
        }

        return acc;
    }, {});
};

export const getReactionReactors = (
    item: ReactionSource,
    reactionKey: EmojiReactionKey
) => {
    return normalizeEmojiReactions(item)[reactionKey] || [];
};

export const getVisibleReactionBuckets = (
    item: ReactionSource
): EmojiReactionBucket[] => {
    const reactions = normalizeEmojiReactions(item);

    return EMOJI_REACTIONS.map((reaction) => ({
        ...reaction,
        reactors: reactions[reaction.key] || [],
    })).filter((reaction) => reaction.reactors.length > 0);
};

export const hasEmojiReactions = (item: ReactionSource) => {
    return getVisibleReactionBuckets(item).length > 0;
};

export const toggleEmojiReaction = <T extends ReactableItem>(
    item: T,
    reactionKey: EmojiReactionKey,
    username: string
): T => {
    const normalized = normalizeEmojiReactions(item);
    const currentReactors = normalized[reactionKey] || [];
    const hasReacted = currentReactors.includes(username);
    const nextReactors = hasReacted
        ? currentReactors.filter((reactor) => reactor !== username)
        : getUniqueUsernames([...currentReactors, username]);

    const nextReactions = {
        ...normalized,
        [reactionKey]: nextReactors,
    };

    EMOJI_REACTIONS.forEach((reaction) => {
        if ((nextReactions[reaction.key] || []).length === 0) {
            delete nextReactions[reaction.key];
        }
    });

    return {
        ...item,
        reactions: nextReactions,
        likes: nextReactions.thumbs_up || [],
        dislikes: nextReactions.thumbs_down || [],
    };
};
