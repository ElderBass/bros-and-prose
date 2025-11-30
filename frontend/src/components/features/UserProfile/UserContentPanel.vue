<template>
    <ExpansionPanel :color="color">
        <template #title>
            <ExpansionPanelTitle :title="title" :color="color" />
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
import ExpansionPanelTitle from "@/components/ui/ExpansionPanelTitle.vue";

withDefaults(
    defineProps<{
        title: string;
        noContentMessage: string;
        hasContent: boolean;
        color?: "blue" | "fuschia" | "green" | "lavender" | "red";
        scrollDirection?: "vertical" | "horizontal";
    }>(),
    {
        color: "blue",
        scrollDirection: "horizontal",
    }
);
</script>

<style scoped>
.scroll-content {
    display: flex;
    gap: 0.75rem;
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
</style>
