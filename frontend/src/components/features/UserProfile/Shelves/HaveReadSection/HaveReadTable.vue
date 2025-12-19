<template>
    <div class="have-read-table">
        <div class="header" role="row">
            <div class="cell title">title</div>
            <div class="cell author">author</div>
            <div class="cell year">year</div>
            <div class="cell pages">pages</div>
            <div class="cell tags">tags</div>
            <div class="cell review">review</div>
        </div>

        <v-virtual-scroll
            class="rows"
            :items="books"
            :height="heightPx"
            :item-height="rowHeightPx"
        >
            <template #default="{ item }">
                <HaveReadTableRow
                    :book="item as BookshelfBook"
                    :review="getReviewForBook((item as BookshelfBook).id)"
                    @open="emit('open', $event)"
                />
            </template>
        </v-virtual-scroll>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BookshelfBook, Review, User } from "@/types";
import HaveReadTableRow from "./HaveReadTableRow.vue";

const props = withDefaults(
    defineProps<{
        books: BookshelfBook[];
        reviewUser?: User | null;
        heightPx?: number;
    }>(),
    {
        books: () => [],
        reviewUser: null,
        heightPx: 400,
    }
);

const emit = defineEmits<{
    (e: "open", book: BookshelfBook): void;
}>();

const rowHeightPx = 44;
const heightPx = computed(() => props.heightPx);

const getReviewForBook = (bookId: string): Review | null => {
    if (!props.reviewUser) return null;
    return props.reviewUser.reviews?.[bookId] ?? null;
};
</script>

<style scoped>
.have-read-table {
    width: 100%;
    border: 1px solid var(--accent-green);
    border-radius: 1rem;
    background-color: color-mix(in srgb, var(--accent-green) 4%, transparent);
    overflow: hidden;
}

.header {
    position: sticky;
    top: 0;
    z-index: 2;
    display: grid;
    grid-template-columns: 2fr 1.4fr 0.6fr 0.6fr 1.2fr 0.8fr;
    gap: 0.5rem;
    padding: 0.65rem 0.75rem;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent-blue) 62%, rgba(0, 0, 0, 0.6)),
        color-mix(in srgb, var(--accent-lavender) 34%, rgba(0, 0, 0, 0.5))
    );
    border-bottom: 1px solid var(--accent-green);
    font-size: 0.85rem;
    text-transform: lowercase;
    letter-spacing: 0.02em;
    color: var(--accent-green);
    opacity: 1;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.28);
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.55);
}

.cell {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: inherit;
}

.rows {
    width: 100%;
}

/* Tighten Vuetify default padding inside the virtual scroll container */
::deep(.v-virtual-scroll__container) {
    padding: 0 !important;
}

@media (max-width: 768px) {
    .header {
        display: none; /* mobile: rows are self-describing enough for now */
    }
}
</style>
