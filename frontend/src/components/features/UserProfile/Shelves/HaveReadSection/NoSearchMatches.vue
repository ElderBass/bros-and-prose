<template>
    <div class="no-matches">
        <p class="no-matches-text">no matches for “{{ query.trim() }}”</p>
        <BaseButton
            variant="outline-secondary"
            title="clear filter"
            size="xsmall"
            @click="emit('clear')"
        >
            clear
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
defineOptions({ name: "NoSearchMatches" });

defineProps<{
    query: string;
}>();

const emit = defineEmits<{
    (e: "clear"): void;
}>();
</script>

<style scoped>
.no-matches {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.no-matches-text {
    margin: 0;
    color: var(--main-text);
    opacity: 0.8;
    font-style: italic;
}
</style>
