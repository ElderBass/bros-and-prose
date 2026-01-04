<template>
    <div class="tab-content">
        <transition name="fade" mode="out-in">
            <component
                v-if="hasItems"
                :is="componentName"
                :items="items"
                :type="type"
            />
            <div v-else class="empty-state" :key="`${type}-empty`">
                <p class="empty-text">no {{ type }} added yet</p>
                <BaseButton
                    v-if="isLoggedInUser"
                    variant="outline"
                    size="small"
                    color="green"
                    :icon="faPlus"
                    @click="handleAdd"
                >
                    add {{ singularType }}
                </BaseButton>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { FavoriteType } from "@/types";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useFavoritesModalStore } from "@/stores/favoritesModal";
import NonBookList from "./NonBookList.vue";
import BookList from "./BookList.vue";

const { type, items, isLoggedInUser } = defineProps<{
    type: FavoriteType;
    items: string[];
    isLoggedInUser: boolean;
}>();

const hasItems = computed(() => {
    return items.length > 0;
});

const singularType = computed(() => {
    if (type === "authors") return "author";
    if (type === "genres") return "genre";
    return "book";
});

const componentName = computed(() => {
    return type === "books" ? BookList : NonBookList;
});

const handleAdd = () => {
    useFavoritesModalStore().openAddModal(type);
};
</script>

<style scoped>
.tab-content {
    padding: 1.25rem;
    min-height: 200px;
    display: flex;
    flex-direction: column;
}

.items-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
}

.item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    gap: 0.5rem;
}

.item-row:hover {
    background: rgba(255, 255, 255, 0.03);
}

.item-text {
    flex: 1;
    color: var(--accent-blue);
    font-size: 0.95rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.item-text::before {
    content: "• ";
    margin-right: 0.5rem;
    opacity: 0.7;
}

.edit-icon {
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.item-row:hover .edit-icon {
    opacity: 1;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem 1rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 0.75rem;
    background: color-mix(in srgb, var(--accent-blue) 3%, transparent);
    min-height: 120px;
}

.empty-text {
    margin: 0;
    font-style: italic;
    opacity: 0.75;
    font-size: 0.9rem;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@media (max-width: 768px) {
    .tab-content {
        padding: 0.75rem;
        min-height: 120px;
    }

    .edit-icon {
        opacity: 1; /* Always visible on mobile */
    }

    .item-text {
        font-size: 0.9rem;
    }

    .empty-state {
        padding: 1.5rem 0.75rem;
        min-height: 100px;
    }
}
</style>
