import type {
    EmojiReactionOption,
    ItemTypeButtonProp,
    ReactionType,
} from "@/types";

export const REACTION_TYPES: ReactionType[] = ["like", "dislike"];

export const EMOJI_REACTIONS: EmojiReactionOption[] = [
    { key: "thumbs_up", emoji: "👍", label: "like" },
    { key: "thumbs_down", emoji: "👎", label: "dislike" },
    { key: "heart", emoji: "❤️", label: "love" },
    { key: "laugh", emoji: "😂", label: "laugh" },
    { key: "eyes", emoji: "👀", label: "eyes" },
    { key: "fire", emoji: "🔥", label: "fire" },
];

export const COMPOSER_ITEM_TYPE_BUTTONS: ItemTypeButtonProp[] = [
    {
        type: "discussion_note",
        label: "comment",
        title: "comment on a book",
    },
    {
        type: "recommendation",
        label: "recommend",
        title: "recommend a book",
    },
    {
        type: "prose_prompt",
        label: "prompt",
        title: "summon the bros to prose",
    },
    {
        type: "suggestion",
        label: "suggest",
        title: "suggest an idea for the app",
    },
    {
        type: "misc",
        label: "misc",
        title: "speak into the void",
    },
];
