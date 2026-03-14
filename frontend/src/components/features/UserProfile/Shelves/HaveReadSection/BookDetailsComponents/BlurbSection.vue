<template>
    <div class="section">
        <BlurbAndDescription
            :blurb="book.userBlurb"
            :description="book.description"
            :showDescription="true"
            :possessiveLabel="possessiveLabel"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BookshelfBook } from "@/types";
import BlurbAndDescription from "@/components/features/common/BlurbAndDescription.vue";

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
