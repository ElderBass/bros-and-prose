<template>
    <div class="favorites-tabs">
        <div class="tabs-header">
            <h5 class="tabs-header-title">FAVORITES</h5>
            <div class="tabs-header-buttons">
                <button
                    v-for="tab in tabs"
                    :key="tab"
                    class="tab-button"
                    :class="{ active: activeTab === tab }"
                    @click="activeTab = tab"
                >
                    {{ tab }}
                </button>
            </div>
        </div>
        <div class="tabs-content">
            <FavoritesTabContent
                :type="activeTab"
                :items="getCurrentItems"
                :isLoggedInUser="isLoggedInUser"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import FavoritesTabContent from "@/components/features/UserProfile/UserInfo/FavoritesStuff/FavoritesTabContent.vue";
import type { UserFavorites, FavoriteType } from "@/types";

const { favorites, isLoggedInUser } = defineProps<{
    favorites: UserFavorites | undefined;
    isLoggedInUser: boolean;
}>();

const tabs: FavoriteType[] = ["authors", "genres", "books"];
const activeTab = ref<FavoriteType>("authors");

const getCurrentItems = computed(() => {
    if (activeTab.value === "books") {
        return (
            Object.values(favorites?.books ?? []).map((book) => book.title) ??
            []
        );
    }
    return Object.values(favorites?.[activeTab.value] ?? []);
});
</script>

<style scoped>
.favorites-tabs {
    background: var(--background-color);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
}

.tabs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 0;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: var(--accent-blue) transparent;
    padding: 0 0.75rem;
}

.tabs-header::-webkit-scrollbar {
    height: 3px;
}

.tabs-header::-webkit-scrollbar-track {
    background: transparent;
}

.tabs-header::-webkit-scrollbar-thumb {
    background: var(--accent-blue);
    border-radius: 3px;
}

.tabs-header-title {
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 1.125rem;
    color: var(--accent-blue);
}

.tab-button {
    background: none;
    border: none;
    color: var(--main-text);
    font-family: "Libre Baskerville", serif;
    font-size: 0.95rem;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid var(--accent-green);
    border-radius: 1rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
    white-space: nowrap;
    position: relative;
    flex-shrink: 0;
}

.tab-button:hover {
    opacity: 0.9;
    background: rgba(255, 255, 255, 0.02);
}

.tab-button.active {
    opacity: 1;
    border-bottom-color: var(--accent-green);
    color: var(--accent-green);
    text-shadow: 0 0 10px var(--accent-green);
}

.tabs-content {
    background: var(--background-color);
    border: 1px solid var(--accent-green);
    border-radius: 1rem;
    width: 100%;
    height: 172px;
}

@media (max-width: 768px) {
    .tabs-header-title {
        font-size: 0.9rem;
    }
    .tab-button {
        font-size: 0.75rem;
        padding: 0.5rem 0.75rem;
    }

    .tabs-content {
        height: 133px;
    }
}
</style>
