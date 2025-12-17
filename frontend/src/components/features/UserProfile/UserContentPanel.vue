<template>
    <ExpansionPanel :color="color" :defaultOpen="defaultOpen">
        <template #title>
            <ExpansionPanelTitle :title="computedTitle" :color="color" />
        </template>
        <template #text>
            <div v-if="!hasContent" class="empty-state">
                <slot name="empty">
                    <p v-if="noContentMessage">{{ noContentMessage }}</p>
                </slot>
            </div>
            <InfiniteScroll
                v-else
                class="scroll-content"
                :class="{ pb: scrollDirection === 'horizontal' }"
                :direction="scrollDirection"
            >
                <slot name="scroll-content" />
            </InfiniteScroll>
        </template>
    </ExpansionPanel>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ExpansionPanelTitle from "@/components/ui/ExpansionPanelTitle.vue";

const props = withDefaults(
    defineProps<{
        title: string;
        noContentMessage?: string;
        contentCount: number;
        color?: "blue" | "fuschia" | "green" | "lavender" | "red" | "yellow";
        scrollDirection?: "vertical" | "horizontal";
        defaultOpen?: boolean;
    }>(),
    {
        color: "yellow",
        scrollDirection: "horizontal",
        contentCount: 0,
        defaultOpen: false,
    }
);

const hasContent = computed(() => props.contentCount > 0);

const computedTitle = computed(() => `${props.title} (${props.contentCount})`);
</script>

<style scoped>
.scroll-content {
    display: flex;
    gap: 1rem;
}

.pb {
    padding-bottom: 1rem;
}

.empty-state {
    padding: 1.5rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 1rem;
    text-align: center;
    font-style: italic;
    opacity: 0.85;
}

@media (max-width: 768px) {
    .scroll-content {
        gap: 0.75rem;
    }
}
</style>
