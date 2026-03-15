<template>
    <span
        class="count-pill"
        :class="`count-pill-${type.toLowerCase()}`"
        :title="title"
    >
        <FontAwesomeIcon :icon="icon" class="count-icon" />
        <span>{{ count }}</span>
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ReactionType } from "@/types";
import {
    faThumbsUp,
    faThumbsDown,
    faComment,
    faQuestion,
} from "@fortawesome/free-solid-svg-icons";

const props = defineProps<{
    type: ReactionType;
    count: number;
}>();

const icon = computed(() => {
    switch (props.type) {
        case "like":
            return faThumbsUp;
        case "dislike":
            return faThumbsDown;
        case "comment":
            return faComment;
        default:
            return faQuestion;
    }
});

const title = computed(() => {
    switch (props.type) {
        case "like":
            return `${props.count} likes`;
        case "dislike":
            return `${props.count} dislikes`;
        case "comment":
            return `${props.count} comments`;
        default:
            return "";
    }
});
</script>

<style scoped>
.count-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.15rem 0.4rem;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
}

.count-pill-like {
    background-color: color-mix(in srgb, var(--accent-green) 25%, transparent);
    border: 1px solid var(--accent-green);
    color: var(--accent-green);
}

.count-pill-dislike {
    background-color: color-mix(in srgb, var(--accent-red) 25%, transparent);
    border: 1px solid var(--accent-red);
    color: var(--accent-red);
}

.count-pill-comment {
    background-color: color-mix(in srgb, var(--accent-blue) 25%, transparent);
    border: 1px solid var(--accent-blue);
    color: var(--accent-blue);
}

.count-icon {
    font-size: 0.65rem;
}
</style>
