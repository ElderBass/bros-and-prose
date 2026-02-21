<template>
    <section class="archives-container">
        <h2 class="section-title">archives</h2>
        <p v-if="!archives.length" class="empty-copy">
            no archived selections yet — keep voting, bros.
        </p>
        <ExpansionPanel
            v-else
            v-for="entry in archives"
            :key="entry.archivedAt + entry.selectorId"
            variant="accordion"
            multiple
        >
            <template #title>
                <div class="panel-title">
                    <span class="selector">
                        {{ selectorLabel(entry.selectorId) }}
                    </span>
                    <span class="separator">•</span>
                    <span class="date">
                        {{ formatDate(entry.archivedAt) }}
                    </span>
                </div>
            </template>
            <template #text>
                <div class="books-grid">
                    <ArchiveBookCard
                        v-for="book in entry.archivedBooks"
                        :key="book.id"
                        :book="book"
                        :isHighlighted="book.id === topBookId(entry)"
                    />
                </div>
            </template>
        </ExpansionPanel>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ArchivedBooksEntry } from "@/types/books";
import ArchiveBookCard from "./ArchiveBookCard.vue";
import { getUserFromId, getMostVotedFutureBookId } from "@/utils";
import { useFutureBooksStore } from "@/stores/futureBooks";

const archives = ref<ArchivedBooksEntry[]>([]);
const selectorCache = ref<Record<string, string>>({});

const loadSelectors = async () => {
    const archivedSelections = useFutureBooksStore().getArchivedSelections;
    const missing = [
        ...new Set(archivedSelections.map((entry) => entry.selectorId)),
    ].filter((id) => !selectorCache.value[id]);

    await Promise.all(
        missing.map(async (id) => {
            const user = await getUserFromId(id);
            selectorCache.value[id] = user
                ? `@${user.username}`
                : "@unknown bro";
        })
    );
    archives.value = archivedSelections;
};

onMounted(async () => {
    await loadSelectors();
});

const selectorLabel = (selectorId: string) => {
    return selectorCache.value[selectorId] || "@loading...";
};

const topBookId = (entry: ArchivedBooksEntry) => {
    if (!entry.archivedBooks.length) return "";
    return getMostVotedFutureBookId(entry.archivedBooks);
};

const formatDate = (iso: string) => {
    try {
        return new Date(iso).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return iso;
    }
};
</script>

<style scoped>
.archives-container {
    width: 100%;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.section-title {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 1rem;
    color: var(--accent-blue);
    margin: 0;
    padding-left: 0.75rem;
}

.empty-copy {
    margin: 0;
    padding: 1rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 0.75rem;
    text-align: center;
    font-size: 0.95rem;
    color: var(--main-text);
    opacity: 0.85;
}

.archives-panels {
    background: transparent;
}

.archive-panel {
    border-radius: 1rem;
    border: 1px solid var(--accent-blue);
    background: rgba(18, 18, 18, 0.6);
    margin-bottom: 0.5rem;
}

:deep(.v-expansion-panel-title__icon) {
    color: var(--accent-blue);
    opacity: 0.9;
    transition:
        color 0.2s ease,
        opacity 0.2s ease;
}

:deep(.v-expansion-panel-title--active .v-expansion-panel-title__icon) {
    color: var(--accent-fuschia);
    opacity: 1;
}

.panel-title {
    display: flex;
    align-items: center;
    gap: 0.2rem;
}

.separator {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--accent-blue);
    margin: 0 0.5rem;
}

.selector {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--accent-fuschia);
}

.date {
    font-size: 1rem;
    color: var(--main-text);
    opacity: 0.8;
}

.books-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

@media (max-width: 768px) {
    .books-grid {
        grid-template-columns: 1fr;
    }

    .title {
        font-size: 1.125rem;
    }

    .separator {
        font-size: 1rem;
        margin: 0 0.25rem;
    }

    .selector {
        font-size: 1rem;
    }

    .date {
        font-size: 0.9rem;
    }
}
</style>
