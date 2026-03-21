<template>
    <span
        class="count-pill"
        :class="[`count-pill-${type.toLowerCase()}`, pillSize]"
        :title="title"
    >
        <FontAwesomeIcon :icon="icon" class="count-icon" />
        <span>{{ count }}</span>
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { ReactionType } from "@/types";
import {
    faThumbsUp,
    faThumbsDown,
    faComment,
    faQuestion,
    faHeart,
} from "@fortawesome/free-solid-svg-icons";

const props = defineProps<{
    type: ReactionType;
    count: number;
}>();

const { mobile } = useDisplay();

const pillSize = computed(() => {
    return mobile.value ? "small" : "medium";
});

const icon = computed(() => {
    switch (props.type) {
        case "like":
            return faThumbsUp;
        case "dislike":
            return faThumbsDown;
        case "comment":
            return faComment;
        case "favorite":
            return faHeart;
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
        case "favorite":
            return `${props.count} favorites`;
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

    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
}

.count-pill.small {
    font-size: 0.75rem;
    padding: 0.175rem 0.35rem;
    gap: 0.25rem;
}

.count-pill.medium {
    font-size: 1.25rem;
    padding: 0.25rem 0.65rem;
    gap: 0.5rem;
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

.count-pill-favorite {
    background-color: color-mix(in srgb, var(--accent-pink) 25%, transparent);
    border: 1px solid var(--accent-pink);
    color: var(--accent-pink);
}

.count-icon {
    font-size: inherit;
}
</style>
