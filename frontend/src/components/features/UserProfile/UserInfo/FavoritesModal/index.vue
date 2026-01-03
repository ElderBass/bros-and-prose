<template>
    <BaseModal
        :modelValue="open"
        @close="closeModal"
        title="add your favorites"
        size="medium"
        shadow-color="lavender"
    >
        <LoadingSpinnerContainer
            v-if="loading"
            size="large"
            message="saving your favorites..."
        />
        <div v-else class="favorites-form">
            <FavSelector
                :selectedType="selectedFavoriteType"
                @select="handleFavoriteTypeChange"
            />

            <component
                :is="currentFormComponent"
                :currentFavorites="getCurrentFavorites"
                @submit="handleSubmit"
            />
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import BaseModal from "@/components/ui/BaseModal.vue";
import FavSelector from "./FavSelector.vue";
import AuthorForm from "./AuthorForm.vue";
import GenreForm from "./GenreForm.vue";
import BookForm from "./BookForm.vue";
import type { FavoriteType, BookshelfBook } from "@/types";
import { useFavoritesModalStore } from "@/stores/favoritesModal";

defineOptions({
    name: "FavoritesModal",
});

const favoritesModalStore = useFavoritesModalStore();
const { closeModal } = favoritesModalStore;
const { open, selectedFavoriteType, existingFavorites } =
    storeToRefs(favoritesModalStore);

const loading = ref(false);

const currentFormComponent = computed(() => {
    switch (selectedFavoriteType.value) {
        case "authors":
            return AuthorForm;
        case "genres":
            return GenreForm;
        case "books":
            return BookForm;
        default:
            return AuthorForm;
    }
});

const getCurrentFavorites = computed(() => {
    if (!existingFavorites.value) {
        return selectedFavoriteType.value === "books" ? [] : [];
    }

    if (selectedFavoriteType.value === "books") {
        return existingFavorites.value.books.map((book) =>
            JSON.stringify(book)
        );
    }

    const favorites = existingFavorites.value[selectedFavoriteType.value];
    return favorites || [];
});

const handleFavoriteTypeChange = (type: FavoriteType) => {
    selectedFavoriteType.value = type;
};

const handleSubmit = (items: string[] | BookshelfBook[]) => {
    console.log("Submitting favorites:", selectedFavoriteType.value, items);
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
        closeModal();
    }, 500);
};
</script>

<style scoped>
.favorites-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    min-height: 400px;
}

@media (max-width: 768px) {
    .favorites-form {
        gap: 1.25rem;
        min-height: 350px;
    }
}
</style>
