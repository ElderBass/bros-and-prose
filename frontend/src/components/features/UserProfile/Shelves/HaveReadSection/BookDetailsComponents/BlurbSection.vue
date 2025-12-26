<template>
    <div class="section">
        <h3 class="section-title">{{ possessiveLabel }} blurb</h3>
        <ExpandableText
            :text="book.description || EMPTY_TEXT"
            :truncateLength="100"
            :isLoggedInUser="canReview"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BookshelfBook } from "@/types";
import ExpandableText from "@/components/features/common/ExpandableText.vue";
import { EMPTY_TEXT } from "@/constants";

const props = defineProps<{
    book: BookshelfBook;
    canReview: boolean;
}>();

const possessiveLabel = computed(() => (props.canReview ? "your" : "bro's"));
</script>

<style scoped>
.section {
    padding-top: 0.75rem;
}

.section-title {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: var(--main-text);
    opacity: 0.9;
    text-transform: lowercase;
}
</style>
