import type { ItemTypeButtonProp, ReactionType } from "@/types";

export const REACTION_TYPES: ReactionType[] = ["like", "dislike"];

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
