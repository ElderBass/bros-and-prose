<template>
    <div class="favorites-section">
        <FavoritesTabs
            :favorites="favorites"
            :isLoggedInUser="isLoggedInUser"
        />
        <FavoritesModal />
    </div>
</template>

<script setup lang="ts">
import FavoritesTabs from "./FavoritesTabs.vue";
import FavoritesModal from "./FavoritesModal/index.vue";
import type { UserFavorites } from "@/types";

const { favorites } = defineProps<{
    favorites: UserFavorites | undefined;
    isLoggedInUser: boolean;
}>();
</script>

<style scoped>
.favorites-section {
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>
