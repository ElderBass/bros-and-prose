<template>
    <button
        type="button"
        class="header-sort-button"
        :class="{ active }"
        :aria-sort="ariaSort"
        @click="emit('click')"
    >
        <span class="label">{{ label }}</span>
        <FontAwesomeIcon
            v-if="active"
            class="sort-icon"
            :icon="direction === 'asc' ? faArrowUp : faArrowDown"
        />
    </button>
</template>

<script setup lang="ts">
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";

defineOptions({ name: "HeaderSortButton" });

withDefaults(
    defineProps<{
        label: string;
        active: boolean;
        direction: "asc" | "desc";
        ariaSort: "none" | "ascending" | "descending";
    }>(),
    {
        direction: "asc",
        ariaSort: "none",
    }
);

const emit = defineEmits<{
    (e: "click"): void;
}>();
</script>

<style scoped>
.header-sort-button {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: inherit;

    background: transparent;
    border: none;
    padding: 0;
    padding-right: 0.5rem;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    cursor: pointer;
    font: inherit;
}

.header-sort-button:hover {
    opacity: 0.95;
}

.header-sort-button.active {
    text-decoration: underline;
    text-underline-offset: 4px;
}

.label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.sort-icon {
    font-size: 0.8rem;
    opacity: 0.95;
}
</style>
