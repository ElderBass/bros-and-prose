<template>
    <div class="review-comment-section" v-if="comment">
        <p class="review-comment-text">what {{ reviewer }} said</p>
        <ExpandableText :text="comment" />
    </div>
    <div v-else class="no-comment-section">
        <p class="no-comment-text">{{ reviewer }} ain't said shit, boi</p>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ExpandableText from "@/components/features/common/ExpandableText.vue";

const props = defineProps<{
    comment: string;
    isFromCurrentUser: boolean;
}>();

const reviewer = computed(() => {
    return props.isFromCurrentUser ? "you" : "homeboy";
});
</script>

<style scoped>
.review-comment-text {
    flex: 0;
    font-size: 1.25rem;
    padding-left: 0.5rem;
    color: var(--accent-lavender);
}

.review-comment-section {
    display: flex;
    flex-direction: column;
}

.no-comment-section {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background: var(--surface-color);
    border: 1px dashed var(--slate-gray);
    border-radius: 0.5rem;
}

.no-comment-text {
    font-style: italic;
    color: var(--slate-gray);
    font-size: 1rem;
    margin: 0;
}

@media (max-width: 768px) {
    .review-comment-text {
        font-size: 1.125rem;
    }
    .comment-text {
        font-size: 1rem;
    }
    .show-more-btn {
        font-size: 0.875rem;
    }
}

@media (max-width: 480px) {
    .review-comment-text {
        font-size: 1rem;
    }

    .comment-text {
        font-size: 0.875rem;
    }
    .show-more-btn {
        font-size: 0.875rem;
    }
}
</style>
