<template>
    <ExpansionPanel :color="color">
        <template #title>
            <ExpansionPanelTitle :title="computedTitle" :color="color" />
        </template>
        <template #text>
            <div v-if="!hasContent" class="empty-state">
                <p>{{ noContentMessage }}</p>
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
        noContentMessage: string;
        contentCount: number;
        color?: "blue" | "fuschia" | "green" | "lavender" | "red";
        scrollDirection?: "vertical" | "horizontal";
    }>(),
    {
        color: "blue",
        scrollDirection: "horizontal",
        contentCount: 0,
    }
);

const hasContent = computed(() => props.contentCount > 0);

const computedTitle = computed(() => `${props.title} (${props.contentCount})`);
</script>

<style scoped>
.scroll-content {
    display: flex;
    gap: 1rem;
    padding: 0.5rem;
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
