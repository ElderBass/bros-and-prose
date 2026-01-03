<template>
    <div class="favorites-section">
        <h4 v-if="favorites">favorites</h4>
        <FavoriteRow
            v-for="fav in favoriteTypes"
            :key="fav"
            :label="fav"
            :items="getRowItems(fav)"
            @addItem="addItem(fav)"
        />
    </div>
</template>

<script setup lang="ts">
import FavoriteRow from "./FavoriteRow.vue";
import type { UserFavorites, FavoriteType } from "@/types";

const { favorites } = defineProps<{
    favorites: UserFavorites | undefined;
}>();

const favoriteTypes: FavoriteType[] = ["authors", "genres", "books"];

const getRowItems = (type: FavoriteType) => {
    if (type === "books") {
        return favorites?.books.map((book) => book.title) ?? [];
    }
    return favorites?.[type] ?? [];
};

const addItem = (type: FavoriteType) => {
    console.log("addItem", type);
};
</script>

<style scoped>
.favorites-section {
    flex: 1 0 50%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0.5rem;
}
</style>
