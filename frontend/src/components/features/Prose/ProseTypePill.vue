<template>
    <span class="type-pill" :class="typeColor">{{ type }}</span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ProseType } from "@/types";
import { getProseTypeColor } from "@/utils";

const props = defineProps<{
    type: ProseType;
}>();

const typeColor = computed(() => {
    return getProseTypeColor(props.type);
});
</script>

<style scoped>
.type-pill {
    flex-shrink: 0;
    text-transform: lowercase;
    padding: 0.125rem 0.65rem;
    border-radius: 999px;
    font-size: 0.875rem;
    letter-spacing: 0.02em;
}

.pink {
    border: 1px solid var(--accent-pink);
    color: var(--accent-pink);
}

.blue {
    border: 1px solid var(--accent-blue);
    color: var(--accent-blue);
}

.lavender {
    border: 1px solid var(--accent-lavender);
    color: var(--accent-lavender);
}

.yellow {
    border: 1px solid var(--accent-yellow);
    color: var(--accent-yellow);
}

.green {
    border: 1px solid var(--accent-green);
    color: var(--accent-green);
}

@media (max-width: 768px) {
    .type-pill {
        padding: 0.1rem 0.5rem;
        font-size: 0.75rem;
    }
}
</style>
