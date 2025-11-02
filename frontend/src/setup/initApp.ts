import { useLog } from "@/composables/useLog";
import router from "@/router";
import { useUIStore } from "@/stores/ui";
import { useBooks } from "@/composables/useBooks";
import { useUser } from "@/composables/useUser";
import { getUserFromStorage, isGuestUser } from "@/utils";

export const initApp = async () => {
    try {
        useUIStore().setIsAppLoading(true);
        await useLog().info("Initializing app");
        useUIStore().initializeScreenSize();
        await useBooks().getPastBooks();
        await useUser().getUsers();
        await useBooks().getFutureBooks();
        await useUser().getFutureBookSelector();

        const userFromStorage = getUserFromStorage();
        console.log("KERTWANGING userFromStorage", userFromStorage);
        if (!userFromStorage && !isGuestUser()) {
            router.push("/");
        } else {
            useLog().info(
                `Fetching user from storage in app: ${userFromStorage.id}`
            );
            const user = await useUser().getUser(userFromStorage.id);
            console.log("KERTWANGING user in initApp", user);
        }
    } catch (error) {
        console.error("Error initializing app:", error);
        await useLog().error(`Error initializing app: ${error}`);
    } finally {
        console.log("KERTWANGING setting isAppLoading to false");
        useUIStore().setIsAppLoading(false);
    }
};
