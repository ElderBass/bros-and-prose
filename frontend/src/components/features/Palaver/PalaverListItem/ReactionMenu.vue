<template>
    <v-menu
        v-model="menuOpen"
        location="bottom end"
        :offset="8"
        content-class="reaction-menu-overlay"
        transition="scale-transition"
        :close-on-content-click="false"
    >
        <template #activator="{ props: menuActivatorProps }">
            <div class="menu-trigger-wrapper">
                <button
                    v-bind="menuActivatorProps"
                    class="reaction-menu-trigger"
                    :class="[
                        `size-${buttonSize}`,
                        { selected: userHasReacted },
                    ]"
                    title="add a reaction"
                    type="button"
                >
                    <span class="trigger-emoji">🙂</span>
                    <span class="trigger-plus">+</span>
                </button>
                <ReactionCountBadge
                    :count="totalReactionCount"
                    color="blue"
                    :isChildComment="isChildComment"
                />
            </div>
        </template>

        <div class="reaction-menu" @click.stop>
            <button
                v-for="reaction in EMOJI_REACTIONS"
                :key="reaction.key"
                class="reaction-option"
                :class="{
                    selected: userHasReactedWith(reaction.key),
                }"
                type="button"
                :title="reactionTitle(reaction)"
                @click="selectReaction(reaction.key)"
            >
                <span class="option-emoji">{{ reaction.emoji }}</span>
                <span v-if="reactorCount(reaction.key)" class="option-count">
                    {{ reactorCount(reaction.key) }}
                </span>
            </button>
        </div>
    </v-menu>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import { EMOJI_REACTIONS } from "@/constants";
import { useUserStore } from "@/stores/user";
import type {
    Comment,
    EmojiReactionKey,
    EmojiReactionOption,
    PalaverEntry,
    ProseEntry,
} from "@/types";
import { getReactionReactors } from "@/utils";
import ReactionCountBadge from "./ReactionCountBadge.vue";

const props = withDefaults(
    defineProps<{
        item: PalaverEntry | ProseEntry | Comment;
        isChildComment?: boolean;
        size?: "supersmall" | "xsmall" | "small" | "medium" | "large";
    }>(),
    {
        isChildComment: false,
        size: undefined,
    }
);

const emit = defineEmits<{
    (e: "select", reactionKey: EmojiReactionKey): void;
}>();

const { mobile } = useDisplay();
const { loggedInUser } = storeToRefs(useUserStore());
const menuOpen = ref(false);

const buttonSize = computed(() => {
    if (props.size !== undefined) return props.size;
    return props.isChildComment
        ? "supersmall"
        : mobile.value
          ? "xsmall"
          : "small";
});

const reactorsByKey = computed(() =>
    EMOJI_REACTIONS.reduce(
        (acc, reaction) => {
            acc[reaction.key] = getReactionReactors(props.item, reaction.key);
            return acc;
        },
        {} as Record<EmojiReactionKey, string[]>
    )
);

const totalReactionCount = computed(() =>
    Object.values(reactorsByKey.value).reduce(
        (total, reactors) => total + reactors.length,
        0
    )
);

const userHasReactedWith = (reactionKey: EmojiReactionKey) => {
    return reactorsByKey.value[reactionKey].includes(
        loggedInUser.value?.username || ""
    );
};

const userHasReacted = computed(() =>
    EMOJI_REACTIONS.some((reaction) => userHasReactedWith(reaction.key))
);

const reactorCount = (reactionKey: EmojiReactionKey) => {
    return reactorsByKey.value[reactionKey].length;
};

const reactionTitle = (reaction: EmojiReactionOption) => {
    return userHasReactedWith(reaction.key)
        ? `remove your ${reaction.label} reaction`
        : `react with ${reaction.label}`;
};

const selectReaction = (reactionKey: EmojiReactionKey) => {
    emit("select", reactionKey);
    menuOpen.value = false;
};
</script>

<style scoped>
.menu-trigger-wrapper {
    position: relative;
}

.reaction-menu-trigger {
    border: 2px solid var(--accent-blue);
    border-radius: 50%;
    background: color-mix(in srgb, var(--accent-blue) 12%, transparent);
    color: var(--main-text);
    cursor: pointer;
    transition:
        transform 0.15s ease,
        border-color 0.15s ease,
        background-color 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    position: relative;
}

.reaction-menu-trigger:hover,
.reaction-menu-trigger.selected {
    border-color: var(--accent-fuschia);
    background: color-mix(in srgb, var(--accent-fuschia) 18%, transparent);
    transform: scale(1.08);
}

.trigger-emoji {
    font-size: 0.92em;
}

.trigger-plus {
    position: absolute;
    right: 0.125rem;
    bottom: 0.055rem;
    font-size: 1rem;
    font-weight: 700;
    color: var(--accent-blue);
}

.reaction-menu-trigger.size-supersmall {
    width: 1.2rem;
    height: 1.2rem;
    font-size: 0.7rem;
    padding: 0.1rem;
}

.reaction-menu-trigger.size-xsmall {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.85rem;
}

.reaction-menu-trigger.size-small {
    width: 2rem;
    height: 2rem;
    font-size: 1.1rem;
}

.reaction-menu-trigger.size-medium {
    width: 3rem;
    height: 3rem;
    font-size: 1.5rem;
}

.reaction-menu-trigger.size-large {
    width: 4rem;
    height: 4rem;
    font-size: 2rem;
}

.reaction-menu {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem;
    border: 1px solid color-mix(in srgb, var(--accent-blue) 45%, transparent);
    border-radius: 999px;
    background: var(--surface-color);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}

.reaction-option {
    position: relative;
    border: 1px solid transparent;
    border-radius: 999px;
    background: transparent;
    color: var(--main-text);
    cursor: pointer;
    min-width: 2.2rem;
    height: 2.2rem;
    padding: 0.2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition:
        transform 0.15s ease,
        background-color 0.15s ease,
        border-color 0.15s ease;
}

.reaction-option:hover,
.reaction-option.selected {
    transform: translateY(-0.1rem) scale(1.08);
    background: color-mix(in srgb, var(--accent-fuschia) 16%, transparent);
    border-color: var(--accent-fuschia);
}

.option-emoji {
    font-size: 1.25rem;
    line-height: 1;
}

.option-count {
    position: absolute;
    right: -0.1rem;
    top: -0.1rem;
    min-width: 0.9rem;
    height: 0.9rem;
    padding: 0 0.18rem;
    border: 1px solid var(--accent-blue);
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.72);
    color: var(--accent-blue);
    font-size: 0.58rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
</style>

<style>
.reaction-menu-overlay {
    border-radius: 999px;
}
</style>
