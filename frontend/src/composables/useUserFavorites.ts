import type { BookshelfBook, FavoriteType, UserFavorites } from "@/types";
import { useUser } from "./useUser";
import { useUserStore } from "@/stores/user";
import { useLog } from "./useLog";

export const useUserFavorites = () => {
    const { updateUser } = useUser();
    const { info } = useLog();

    const updateUserFavorites = async (favorites: UserFavorites) => {
        console.log("KERTWANGING updateUserFavorites", favorites);
        const loggedInUser = useUserStore().loggedInUser;
        const updatedUser = await updateUser(loggedInUser.id, {
            ...loggedInUser,
            favorites,
        });
        await info(`Updated favorites for ${loggedInUser.username}`);
        return updatedUser;
    };

    const updateFavorite = async (
        favoriteType: FavoriteType,
        items: string[] | BookshelfBook[]
    ) => {
        const loggedInUser = useUserStore().loggedInUser;
        const updatedUser = await updateUser(loggedInUser.id, {
            ...loggedInUser,
            favorites: { ...loggedInUser.favorites, [favoriteType]: items },
        });
        await info(`Updated '${favoriteType}' for ${loggedInUser.username}`);
        return updatedUser;
    };
    return {
        updateUserFavorites,
        updateFavorite,
    };
};
