<template>
    <div class="have-read-table">
        <TableSearchInput
            v-model="query"
            :totalCount="books.length"
            :visibleCount="visibleBooks.length"
        />

        <div class="header" role="row">
            <HeaderSortButton
                label="title"
                :active="sortKey === 'title'"
                :direction="sortDir"
                :ariaSort="ariaSort('title')"
                @click="toggleSort('title')"
            />

            <HeaderSortButton
                label="author"
                :active="sortKey === 'author'"
                :direction="sortDir"
                :ariaSort="ariaSort('author')"
                @click="toggleSort('author')"
            />
            <div class="cell year">year</div>
            <div class="cell pages">pages</div>
            <div class="cell tags">tags</div>

            <HeaderSortButton
                label="review"
                :active="sortKey === 'rating'"
                :direction="sortDir"
                :ariaSort="ariaSort('rating')"
                @click="toggleSort('rating')"
            />
        </div>

        <Transition name="table-results" mode="out-in">
            <div :key="resultsKey">
                <NoSearchMatches
                    v-if="visibleBooks.length === 0"
                    :query="query"
                    @clear="query = ''"
                />

                <v-virtual-scroll
                    v-else
                    class="rows"
                    :items="visibleBooks"
                    :height="heightPx"
                    :item-height="rowHeightPx"
                >
                    <template #default="{ item }">
                        <HaveReadTableRow
                            :book="item as BookshelfBook"
                            :review="
                                getReviewForBook((item as BookshelfBook).id)
                            "
                            @open="openBookDetails(item as BookshelfBook)"
                        />
                    </template>
                </v-virtual-scroll>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { BookshelfBook, Review, User } from "@/types";
import HaveReadTableRow from "./HaveReadTableRow.vue";
import TableSearchInput from "./TableSearchInput.vue";
import NoSearchMatches from "./NoSearchMatches.vue";
import HeaderSortButton from "./HeaderSortButton.vue";
import { useShelfModalStore } from "@/stores/shelfModal";

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

const rowHeightPx = 44;
const heightPx = computed(() => props.heightPx);

type SortKey = "title" | "author" | "rating";
type SortDir = "asc" | "desc";

const query = ref("");
const sortKey = ref<SortKey>("title");
const sortDir = ref<SortDir>("asc");

const openBookDetails = (book: BookshelfBook) => {
    useShelfModalStore().openBookDetails(book, "haveRead");
};

const getReviewForBook = (bookId: string): Review | null => {
    if (!props.reviewUser) return null;
    return props.reviewUser.reviews?.[bookId] ?? null;
};

const toggleSort = (key: SortKey) => {
    if (sortKey.value === key) {
        sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
        return;
    }
    sortKey.value = key;
    sortDir.value = "asc";
};

const ariaSort = (key: SortKey) => {
    if (sortKey.value !== key) return "none";
    return sortDir.value === "asc" ? "ascending" : "descending";
};

const getRatingValue = (bookId: string): number | null => {
    const r = getReviewForBook(bookId);
    return r ? (r.rating ?? 0) : null;
};

const visibleBooks = computed(() => {
    const q = query.value.trim().toLowerCase();

    const filtered = q
        ? props.books.filter((b) => {
              const title = (b.title || "").toLowerCase();
              const author = (b.author || "").toLowerCase();
              return title.includes(q) || author.includes(q);
          })
        : props.books;

    const dir = sortDir.value === "asc" ? 1 : -1;

    const sorted = [...filtered].sort((a, b) => {
        if (sortKey.value === "title") {
            const cmp = (a.title || "").localeCompare(
                b.title || "",
                undefined,
                {
                    sensitivity: "base",
                }
            );
            if (cmp !== 0) return cmp * dir;
        } else if (sortKey.value === "author") {
            const cmp = (a.author || "").localeCompare(
                b.author || "",
                undefined,
                { sensitivity: "base" }
            );
            if (cmp !== 0) return cmp * dir;
        } else if (sortKey.value === "rating") {
            const ar = getRatingValue(a.id);
            const br = getRatingValue(b.id);
            // Keep unreviewed books at the bottom regardless of sort direction.
            if (ar === null && br !== null) return 1;
            if (ar !== null && br === null) return -1;
            if (ar !== null && br !== null && ar !== br) return (ar - br) * dir;
        }

        // Stable tie-breaker
        return (a.id || "").localeCompare(b.id || "", undefined, {
            sensitivity: "base",
        });
    });

    return sorted;
});

const resultsKey = computed(() => {
    // Key the results region so it cross-fades when query/sort changes.
    return `${query.value.trim().toLowerCase()}|${sortKey.value}|${sortDir.value}|${visibleBooks.value.length}`;
});
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
    top: 0; /* stays below controls because controls are outside sticky header */
    z-index: 2;
    display: grid;
    grid-template-columns: 2fr 1.4fr 0.6fr 0.6fr 1.2fr 0.8fr;
    gap: 0.5rem;
    padding: 0.65rem 0.75rem;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent-fuschia) 62%, rgba(0, 0, 0, 0.6)),
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

/* Smooth transition when filter/sort changes the visible rows */
.table-results-enter-active,
.table-results-leave-active {
    transition:
        opacity 160ms ease,
        transform 160ms ease;
}

.table-results-enter-from,
.table-results-leave-to {
    opacity: 0;
    transform: translateY(4px);
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
