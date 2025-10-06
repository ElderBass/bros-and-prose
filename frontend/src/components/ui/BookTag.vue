<template>
    <div
        class="book-tag"
        :class="[`book-tag-${color}`, { selected, clickable: !!onClick }]"
        :selected="selected"
        @click="onClick"
    >
        {{ tag }}
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        tag: string;
        selected: boolean;
        color?: "blue" | "fuschia" | "green" | "lavender";
        onClick?: () => void;
    }>(),
    {
        selected: false,
        color: "blue",
    }
);
</script>

<style scoped>
.book-tag {
    background-color: inherit;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
}

.book-tag.clickable:hover {
    cursor: pointer;
}

.book-tag-blue {
    color: var(--accent-blue);
    border: 1px solid var(--accent-blue);
}

.book-tag-fuschia {
    color: var(--accent-fuschia);
    border: 1px solid var(--accent-fuschia);
}

.book-tag-green {
    color: var(--accent-green);
    border: 1px solid var(--accent-green);
}

.book-tag-lavender {
    color: var(--accent-lavender);
    border: 1px solid var(--accent-lavender);
}

.book-tag-blue[selected="true"] {
    background-color: var(--accent-blue);
    color: var(--background-color);
}

.book-tag-fuschia[selected="true"] {
    background-color: var(--accent-fuschia);
    color: var(--background-color);
}

.book-tag-green[selected="true"] {
    background-color: var(--accent-green);
    color: var(--background-color);
}

.book-tag-lavender[selected="true"] {
    background-color: var(--accent-lavender);
    color: var(--background-color);
}

.book-tag:hover {
    background-color: var(--accent-blue);
    color: var(--background-color);
}

.book-tag-fuschia:hover {
    background-color: var(--accent-fuschia);
    color: var(--background-color);
}

.book-tag-green:hover {
    background-color: var(--accent-green);
    color: var(--background-color);
}

.book-tag-lavender:hover {
    background-color: var(--accent-lavender);
    color: var(--background-color);
}
</style>
