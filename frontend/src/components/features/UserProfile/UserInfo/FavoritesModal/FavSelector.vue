<template>
    <div class="fav-selector">
        <button
            v-for="type in favoriteTypes"
            :key="type"
            :class="['fav-button', { active: type === selectedType }]"
            @click="selectType(type)"
        >
            <FontAwesomeIcon :icon="getIcon(type)" />
            <span>{{ type }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import type { FavoriteType } from "@/types";
import { faPenNib, faTags, faBook } from "@fortawesome/free-solid-svg-icons";

defineOptions({
    name: "FavSelector",
});

const { selectedType } = defineProps<{
    selectedType: FavoriteType;
}>();

const emit = defineEmits<{
    (e: "select", type: FavoriteType): void;
}>();

const favoriteTypes: FavoriteType[] = ["authors", "genres", "books"];

const selectType = (type: FavoriteType) => {
    emit("select", type);
};

const getIcon = (type: FavoriteType) => {
    switch (type) {
        case "authors":
            return faPenNib;
        case "genres":
            return faTags;
        case "books":
            return faBook;
        default:
            return faBook;
    }
};
</script>

<style scoped>
.fav-selector {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
    flex-wrap: wrap;
}

.fav-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--accent-lavender);
    border-radius: 2rem;
    background: transparent;
    color: var(--accent-lavender);
    font-family: "Libre Baskerville", serif;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
}

.fav-button:hover {
    background: rgba(179, 136, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(179, 136, 255, 0.3);
}

.fav-button.active {
    background: var(--accent-lavender);
    color: var(--background-color);
    box-shadow:
        0 4px 16px rgba(179, 136, 255, 0.4),
        0 0 20px rgba(179, 136, 255, 0.2);
    font-weight: 600;
}

.fav-button.active:hover {
    transform: translateY(-2px) scale(1.02);
}

@media (max-width: 768px) {
    .fav-selector {
        gap: 0.5rem;
    }

    .fav-button {
        padding: 0.6rem 1.25rem;
        font-size: 0.85rem;
    }
}
</style>
