<template>
    <div class="favorites-section">
        <FavoritesTabs
            :favorites="favorites"
            :isLoggedInUser="isLoggedInUser"
            @addItem="addItem"
            @editItem="editItem"
        />
    </div>
</template>

<script setup lang="ts">
import FavoritesTabs from "./FavoritesTabs.vue";
import type { UserFavorites, FavoriteType } from "@/types";

const { favorites } = defineProps<{
    favorites: UserFavorites | undefined;
    isLoggedInUser: boolean;
}>();

const addItem = (type: FavoriteType) => {
    console.log("addItem", type);
};

const editItem = (type: FavoriteType, index: number) => {
    console.log("editItem", type, index);
};
</script>

<style scoped>
.favorites-section {
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>
