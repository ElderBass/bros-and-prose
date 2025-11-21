import { useLog } from "@/composables/useLog";
import router from "@/router";
import { useUIStore } from "@/stores/ui";
import { useBooks } from "@/composables/useBooks";
import { useFutureBooks } from "@/composables/useFutureBooks";
import { useUser } from "@/composables/useUser";
import { getUserFromStorage, isGuestUser } from "@/utils";
import { usePalaver } from "@/composables/usePalaver";

export const initApp = async () => {
    try {
        useUIStore().setIsAppLoading(true);
        await useLog().info("Initializing app");
        useUIStore().initializeScreenSize();
        await useBooks().getCurrentBook();
        await useBooks().getPastBooks();
        await useUser().getUsers();
        await useUser().getFutureBookSelector();
        await useFutureBooks().getCurrentSelections(true);
        await usePalaver().getPalaverEntries(true);

        const userFromStorage = getUserFromStorage();
        if (userFromStorage) {
            useLog().info(
                `Fetching user from storage in app: ${userFromStorage.id}`
            );
            const user = await useUser().getUser(userFromStorage.id);
            console.log("KERTWANGING user in initApp", user);
        } else if (isGuestUser()) {
            useLog().info("Guest user found, redirecting to present page...");
            router.push("/present");
        } else {
            useLog().info(
                "No user found in storage, redirecting to landing page..."
            );
            router.push("/");
        }
    } catch (error) {
        console.error("Error initializing app:", error);
        await useLog().error(`Error initializing app: ${error}`);
    } finally {
        console.log("KERTWANGING setting isAppLoading to false");
        useUIStore().setIsAppLoading(false);
    }
};
