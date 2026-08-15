<template>
    <div v-if="hasReactions" class="emoji-reaction-pills">
        <ReactionPill
            v-for="reaction in reactionBuckets"
            :key="reaction.key"
            :type="reaction.key"
            :emoji="reaction.emoji"
            :label="reaction.label"
            :count="reaction.reactors.length"
            :reactors="reaction.reactors"
            :size="size"
            :clickable="clickable"
            :disabled="disabled"
            :userHasReacted="userHasReactedWith(reaction.key)"
            @select="emit('select', reaction.key)"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import ReactionPill from "@/components/features/common/ReactionPill.vue";
import { useUserStore } from "@/stores/user";
import type {
    Comment,
    EmojiReactionKey,
    EmojiReactions,
    PalaverEntry,
    ProseEntry,
} from "@/types";
import { getReactionReactors, getVisibleReactionBuckets } from "@/utils";

type ReactionSource =
    | PalaverEntry
    | ProseEntry
    | Comment
    | {
          likes?: string[];
          dislikes?: string[];
          reactions?: EmojiReactions;
      };

const props = withDefaults(
    defineProps<{
        item: ReactionSource;
        size?: "xsmall" | "small" | "medium";
        clickable?: boolean;
        disabled?: boolean;
        filterReactors?: (username: string) => boolean;
    }>(),
    {
        size: "medium",
        clickable: false,
        disabled: false,
        filterReactors: undefined,
    }
);

const emit = defineEmits<{
    (e: "select", reactionKey: EmojiReactionKey): void;
}>();

const { loggedInUser } = storeToRefs(useUserStore());

const reactionBuckets = computed(() =>
    getVisibleReactionBuckets(props.item)
        .map((reaction) => ({
            ...reaction,
            reactors: props.filterReactors
                ? reaction.reactors.filter(props.filterReactors)
                : reaction.reactors,
        }))
        .filter((reaction) => reaction.reactors.length > 0)
);

const hasReactions = computed(() => reactionBuckets.value.length > 0);

const userHasReactedWith = (reactionKey: EmojiReactionKey) => {
    return getReactionReactors(props.item, reactionKey).includes(
        loggedInUser.value?.username || ""
    );
};
</script>

<style scoped>
.emoji-reaction-pills {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    flex-wrap: wrap;
}
</style>
