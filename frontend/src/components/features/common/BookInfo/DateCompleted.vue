<template>
    <div v-if="book.dateCompleted" class="date-completed">
        <p class="label">date completed</p>
        <p class="date">{{ formattedDate }}</p>
    </div>
</template>

<script setup lang="ts">
import type { Book } from "@/types";
import { computed } from "vue";

const props = defineProps<{
    book: Book;
}>();

const formatDate = (iso: string) => {
    try {
        return new Date(iso).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return iso || "unknown";
    }
};

const formattedDate = computed(() => {
    return props.book.dateCompleted
        ? formatDate(props.book.dateCompleted)
        : "unknown";
});
</script>

<style scoped>
.date-completed {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    align-items: center;
    text-align: right;
    width: 100%;
}

.label {
    font-size: 1rem;
}

.date {
    font-size: 1rem;
    font-weight: 600;
    color: var(--accent-lavender);
}

@media (min-width: 768px) {
    .date {
        font-size: 1.125rem;
    }
}
</style>
