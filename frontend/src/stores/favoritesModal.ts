import type { FavoriteType, UserFavorites } from "@/types";
import { defineStore } from "pinia";

interface ModalState {
    open: boolean;
    isEdit: boolean;
    selectedFavoriteType: FavoriteType;
    existingFavorites: UserFavorites;
}

export const useFavoritesModalStore = defineStore("favoritesModal", {
    state: (): ModalState => ({
        open: false,
        isEdit: false,
        selectedFavoriteType: "authors",
        existingFavorites: {
            authors: [],
            genres: [],
            books: [],
        },
    }),
    actions: {
        openModal(type: FavoriteType, isEdit = false) {
            this.open = true;
            this.isEdit = isEdit;
            this.selectedFavoriteType = type;
        },
        openAddModal(type: FavoriteType) {
            this.openModal(type, false);
        },
        openEditModal(type: FavoriteType) {
            this.openModal(type, true);
        },
        closeModal() {
            this.open = false;
            this.isEdit = false;
            this.selectedFavoriteType = "authors";
            this.existingFavorites = {
                authors: [],
                genres: [],
                books: [],
            };
        },
    },
    getters: {
        isModalOpen: (state) => state.open,
    },
});
