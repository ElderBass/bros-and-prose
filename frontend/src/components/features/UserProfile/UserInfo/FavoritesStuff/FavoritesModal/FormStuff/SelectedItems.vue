<template>
    <div v-if="items.length > 0" class="items-list">
        <TransitionGroup name="list">
            <div v-for="(item, index) in items" :key="item" class="item-chip">
                <span>{{ item }}</span>
                <IconButton
                    :icon="faXmark"
                    size="supersmall"
                    color="fuschia"
                    :handleClick="() => emit('removeItem', index)"
                    :title="`remove ${item}`"
                />
            </div>
        </TransitionGroup>
    </div>

    <div v-else class="empty-state">
        <p>no authors added yet. start by typing one above!</p>
    </div>
</template>

<script setup lang="ts">
import { faXmark } from "@fortawesome/free-solid-svg-icons";

defineProps<{
    items: string[];
}>();

const emit = defineEmits<{
    (e: "removeItem", index: number): void;
}>();
</script>

<style scoped>
.items-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0.75rem;
    min-height: 80px;
}

.item-chip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--surface-color);
    border: 2px solid var(--accent-lavender);
    border-radius: 2rem;
    color: var(--accent-lavender);
    font-size: 0.9rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.item-chip:hover {
    box-shadow: 0 4px 12px rgba(179, 136, 255, 0.3);
    transform: translateY(-2px);
}

.item-chip span {
    flex: 1;
    white-space: nowrap;
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    border: 2px dashed var(--accent-lavender);
    border-radius: 0.75rem;
    background: color-mix(in srgb, var(--accent-lavender) 3%, transparent);
    min-height: 100px;
}

.empty-state p {
    margin: 0;
    font-style: italic;
    opacity: 0.75;
    font-size: 0.95rem;
    text-align: center;
}

/* List transition animations */
.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.list-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.list-move {
    transition: transform 0.3s ease;
}

@media (max-width: 768px) {
    .items-list {
        gap: 0.5rem;
        padding: 0.75rem;
    }

    .item-chip {
        padding: 0.4rem 0.75rem;
        font-size: 0.85rem;
    }

    .empty-state {
        padding: 1.5rem 0.75rem;
    }
}
</style>
