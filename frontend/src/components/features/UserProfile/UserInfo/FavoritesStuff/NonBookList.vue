<template>
    <div class="non-book-list">
        <InfiniteScroll direction="horizontal" height="100%">
            <NonBookListColumn
                v-for="(column, index) in columns"
                :key="index"
                :items="column"
            />
        </InfiniteScroll>
        <div class="button-wrapper">
            <IconButton
                v-if="!isGuestUser()"
                :icon="faMarker"
                title="edit list"
                size="small"
                color="blue"
                :handleClick="onEditList"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import NonBookListColumn from "./NonBookListColumn.vue";
import InfiniteScroll from "@/components/ui/InfiniteScroll.vue";
import { getNonBookItemColumns } from "@/utils/userFavoritesUtils";
import { faMarker } from "@fortawesome/free-solid-svg-icons";
import { useFavoritesModalStore } from "@/stores/favoritesModal";
import type { FavoriteType } from "@/types";
import { isGuestUser } from "@/utils";

const props = defineProps<{
    items: string[];
    type: FavoriteType;
}>();

const columns = computed(() => getNonBookItemColumns(props.items));

const onEditList = () => {
    useFavoritesModalStore().openEditModal(props.type);
};
</script>

<style scoped>
.non-book-list {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 0.25rem;
    overflow-x: auto;
    height: 100%;
}

.button-wrapper {
    align-self: center;
    padding: 0 0.25rem;
}

@media (max-width: 768px) {
    .non-book-list {
        gap: 0.125rem;
    }
}
</style>
