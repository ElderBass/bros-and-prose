<template>
    <div class="no-tags">
        <span class="italics">no tags like Hanes briefs</span>
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        size?: "xsmall" | "small" | "medium" | "large";
    }>(),
    {
        size: "medium",
    }
);
</script>

<style scoped>
.no-tags {
    text-align: center;
    max-width: 60%;
    border: 1px dashed var(--accent-blue);
    border-radius: 1rem;
    padding: 0.5rem;
    font-size: 0.875rem;
    font-style: italic;
    color: var(--main-text);
    opacity: 0.75;
    max-width: 180px;
}
.no-tags.size-xsmall {
    font-size: 0.75rem;
    max-width: 150px;
}

.no-tags.size-small {
    font-size: 0.85rem;
    max-width: 180px;
}

.no-tags.size-medium {
    font-size: 1rem;
    max-width: 240px;
}

.no-tags.size-large {
    font-size: 1.125rem;
    max-width: 300px;
}
</style>
