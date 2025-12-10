<template>
    <RouterLink
        class="router-link-wrapper username-link"
        :class="`font-size-${fontSize}`"
        :to="`/profile/${username}`"
    >
        @{{ username }}
    </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps<{
    username: string;
    fontSize?: "small" | "medium" | "large";
}>();
</script>

<style scoped>
.username-link {
    color: var(--accent-fuschia);
    text-decoration: none;
    font-weight: 600;
}

.username-link:hover {
    text-decoration: underline;
}

.username-link.font-size-small {
    font-size: 1rem;
}

.username-link.font-size-medium {
    font-size: 1.25rem;
}

.username-link.font-size-large {
    font-size: 1.5rem;
}
</style>
