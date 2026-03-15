<template>
    <div class="prose-list-wrap">
        <ProseTypeFilters />

        <div v-if="!entries.length" class="empty-state">
            <p class="empty-title">{{ emptyTitle }}</p>
            <p class="empty-subtitle">
                {{ emptySubtitle }}
            </p>
        </div>

        <div v-else class="prose-list">
            <ProseListItem
                v-for="entry in entries"
                :key="entry.id"
                :entry="entry"
                @edit="$emit('edit', $event)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";
import ProseTypeFilters from "./ProseTypeFilters.vue";
import ProseListItem from "./ProseListItem.vue";
import { useProseStore } from "@/stores/prose";
import type { ProseEntry } from "@/types";
import { useProse } from "@/composables";

defineEmits<{
    (e: "edit", entry: ProseEntry): void;
}>();

const {
    filteredEntries: entries,
    entries: allEntries,
    activeFilterLabel,
} = storeToRefs(useProseStore());

const emptyTitle = computed(() => {
    if (!allEntries.value.length) {
        return "no prose yet";
    }
    return `no ${activeFilterLabel.value} prose yet`;
});

const emptySubtitle = computed(() => {
    if (!allEntries.value.length) {
        return "publish the first one and get the section started.";
    }
    return "try another type or publish a new piece in this category.";
});

onMounted(async () => {
    await useProse().getProseEntries();
});
</script>

<style scoped>
.prose-list-wrap {
    width: 100%;
    max-width: 920px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.prose-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.empty-state {
    margin-top: 1rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 1rem;
    background: rgba(0, 191, 255, 0.06);
    padding: 1rem;
    text-align: center;
}

.empty-title {
    color: var(--accent-blue);
    font-size: 1.15rem;
    margin: 0;
}

.empty-subtitle {
    color: var(--main-text);
    opacity: 0.82;
    margin: 0.35rem 0 0;
}

@media (max-width: 768px) {
    .prose-list-wrap {
        gap: 0.5rem;
    }

    .prose-list {
        gap: 0.65rem;
    }

    .empty-state {
        margin-top: 0.65rem;
        padding: 0.65rem;
        border-radius: 0.65rem;
    }

    .empty-title {
        font-size: 0.95rem;
    }

    .empty-subtitle {
        font-size: 0.85rem;
        margin-top: 0.25rem;
    }
}
</style>
