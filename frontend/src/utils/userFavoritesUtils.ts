import { useUserStore } from "@/stores/user";
import type { FavoriteType } from "@/types";

export const getUpdatedFavorites = (
    selectedFavoriteType: FavoriteType,
    items: string[]
) => {
    const user = useUserStore().loggedInUser;
    const updatedFavorites = {
        ...user.favorites,
        [selectedFavoriteType]: Array.from(new Set(items)),
    };
    return updatedFavorites;
};

export const getNonBookItemColumns = (items: string[]) => {
    const itemsPerColumn = 3;
    const columns: string[][] = [];

    for (let i = 0; i < items.length; i += itemsPerColumn) {
        columns.push(items.slice(i, i + itemsPerColumn));
    }

    return columns;
};
