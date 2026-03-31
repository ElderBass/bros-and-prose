<template>
    <div class="past-book-table">
        <div class="table-title-wrap">
            <h3 class="table-title">book club archives</h3>
            <IconButton
                :icon="faArrowRightArrowLeft"
                :title="sortButtonTitle"
                size="small"
                color="fuschia"
                :handleClick="toggleSortOrder"
            />
        </div>

        <div class="header" role="row">
            <div class="cell">title</div>
            <div class="cell">author</div>
            <div class="cell">published</div>
            <div class="cell">nominated by</div>
            <div class="cell">completed</div>
            <div class="cell details">details</div>
        </div>

        <div class="rows-scroller">
            <PastBookTableRow
                v-for="book in sortedPastBooks"
                :key="book.id"
                :book="book"
                @open="openPastBookDetails"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useBooksStore } from "@/stores/books";
import type { Book } from "@/types";
import PastBookTableRow from "./PastBookTableRow.vue";
import IconButton from "@/components/ui/IconButton.vue";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";

const { pastBooks } = useBooksStore();
const router = useRouter();
const sortOrder = ref<"asc" | "desc">("desc");

const sortedPastBooks = computed(() => {
    return [...pastBooks].sort((a, b) => {
        const aDate = a.dateCompleted ? new Date(a.dateCompleted).getTime() : 0;
        const bDate = b.dateCompleted ? new Date(b.dateCompleted).getTime() : 0;
        return sortOrder.value === "desc" ? bDate - aDate : aDate - bDate;
    });
});

const openPastBookDetails = (book: Book) => {
    router.push(`/past/${book.id}`);
};

const sortButtonTitle = computed(() =>
    sortOrder.value === "desc"
        ? "sort list (newest first)"
        : "sort list (oldest first)"
);

const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === "desc" ? "asc" : "desc";
};
</script>

<style scoped>
.past-book-table {
    width: 100%;
    padding: 0.5rem 0;
    border: 1px solid var(--accent-fuschia);
    border-radius: 1rem;
    background-color: color-mix(in srgb, var(--accent-fuschia) 4%, transparent);
    overflow: hidden;
}

.table-title-wrap {
    padding: 0.85rem 0.9rem 0.65rem;
    border-bottom: 1px solid
        color-mix(in srgb, var(--accent-fuschia) 28%, transparent);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.table-kicker {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    font-size: 0.72rem;
    color: var(--accent-green);
    opacity: 0.9;
}

.table-title {
    margin: 0.1rem 0 0;
    color: var(--accent-blue);
    font-size: 1.05rem;
    line-height: 1.2;
}

.header {
    position: sticky;
    top: 0;
    z-index: 2;
    display: grid;
    grid-template-columns: 2fr 1.4fr 0.7fr 1fr 1fr 0.9fr;
    gap: 0.5rem;
    padding: 0.65rem 0.75rem;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent-fuschia) 62%, rgba(0, 0, 0, 0.6)),
        color-mix(in srgb, var(--accent-lavender) 34%, rgba(0, 0, 0, 0.5))
    );
    border-bottom: 1px solid var(--accent-fuschia);
    font-size: 0.85rem;
    text-transform: lowercase;
    letter-spacing: 0.02em;
    color: var(--accent-green);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.28);
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.55);
}

.cell {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.cell.details {
    text-align: right;
}

.rows-scroller {
    width: 100%;
    max-height: 640px;
    overflow-y: auto;
    overflow-x: hidden;
}

@media (min-width: 768px) {
    .table-title {
        font-size: 1.2rem;
    }
}

@media (max-width: 768px) {
    .header {
        display: none;
    }
}
</style>
