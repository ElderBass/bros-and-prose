<template>
    <div class="prose-favorites-list">
        <div class="items">
            <ProseListItem
                v-for="entry in parsedEntries"
                :key="entry.id"
                :entry="entry"
                :compact="true"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { FavoriteType, ProseEntry } from "@/types";
import ProseListItem from "@/components/features/Prose/ProseListItem.vue";

const props = defineProps<{
    items: string[];
    type: FavoriteType;
}>();

const parsedEntries = computed(() => {
    return props.items
        .map((raw) => {
            try {
                return JSON.parse(raw) as ProseEntry;
            } catch {
                return null;
            }
        })
        .filter((v): v is ProseEntry => v != null && v.id != null);
});
</script>

<style scoped>
.prose-favorites-list {
    padding: 0.5rem 0.25rem;
}

.items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}
</style>
