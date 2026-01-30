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
                @cancel="closeModal"
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
import { useUIStore } from "@/stores/ui";
import { useLog, useUserFavorites } from "@/composables";
import { getUpdatedFavorites } from "@/utils";
import { FAVORITES_UPDATED_SUCCESS_ALERT, QUICK_ERROR } from "@/constants";
import { useUserStore } from "@/stores/user";

defineOptions({
    name: "FavoritesModal",
});

const favoritesModalStore = useFavoritesModalStore();
const { closeModal } = favoritesModalStore;
const { open, selectedFavoriteType } = storeToRefs(favoritesModalStore);

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
    const userFavorites = useUserStore().loggedInUser.favorites;
    if (!userFavorites) {
        return selectedFavoriteType.value === "books" ? [] : [];
    }

    if (selectedFavoriteType.value === "books") {
        return userFavorites.books?.map((book) => JSON.stringify(book)) || [];
    }

    const favorites = userFavorites[selectedFavoriteType.value];
    return favorites || [];
});

const handleFavoriteTypeChange = (type: FavoriteType) => {
    selectedFavoriteType.value = type;
};

const handleSubmit = async (items: string[] | BookshelfBook[]) => {
    try {
        loading.value = true;
        const updatedFavorites = getUpdatedFavorites(
            selectedFavoriteType.value,
            items
        );
        await useUserFavorites().updateUserFavorites(updatedFavorites);
        useUIStore().showAlert(FAVORITES_UPDATED_SUCCESS_ALERT);
    } catch (error) {
        console.error("Error submitting favorites:", error);
        await useLog().error(`Error submitting favorites: ${error}`);
        useUIStore().showAlert(
            QUICK_ERROR([
                "Error submitting favorites",
                "probably got rejected because your shit's so weak",
            ])
        );
    } finally {
        loading.value = false;
        closeModal();
    }
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
