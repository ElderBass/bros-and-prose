import { useUserStore } from "@/stores/user";
import type { FavoriteType } from "@/types";

export const getUpdatedFavorites = (
    selectedFavoriteType: FavoriteType,
    items: string[]
) => {
    const user = useUserStore().loggedInUser;
    const updatedFavorites = {
        ...user.favorites,
        [selectedFavoriteType]: items,
    };
    return updatedFavorites;
};
