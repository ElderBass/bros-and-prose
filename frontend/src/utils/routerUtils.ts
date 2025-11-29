import { useUser, useLog } from "@/composables";
import { useUIStore } from "@/stores/ui";
import { useUserStore } from "@/stores/user";
import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router";

export const beforeEnterProfileView = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    try {
        useUIStore().setIsAppLoading(true);
        const username = to.params.username as string;
        const user = await useUser().getUserByUsername(username);
        if (!user) {
            return next({ name: "four-oh-four" });
        }
        to.meta.user = user;
        to.meta.isLoggedInUser = user.id === useUserStore().loggedInUser?.id;
        next();
    } catch (error) {
        console.error("Error fetching user", error);
        await useLog().error(`Error fetching user: ${error}`);
        next({ name: "four-oh-four" });
    } finally {
        useUIStore().setIsAppLoading(false);
    }
};
