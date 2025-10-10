import { defineStore } from "pinia";
import type { User } from "@/types";
import {
    setUserInStorage,
    removeUserFromStorage,
    getUserFromStorage,
} from "@/utils";
import { FUTURE_BOOK_SELECTOR } from "@/constants";
import { useLog } from "@/composables/useLog";

export const useUserStore = defineStore("user", {
    state: () => ({
        loggedInUser: (getUserFromStorage() || ({} as User)) as User,
        allUsers: [] as User[],
        futureBookSelector: {} as User,
        futureBookSelectorUsername: "",
    }),

    getters: {
        isLoggedIn: (state) => !!state.loggedInUser,
        currentUserName: (state) =>
            state.loggedInUser
                ? `${state.loggedInUser.firstName} ${state.loggedInUser.lastName}`
                : "",
        currentUserReviews: (state) => state.loggedInUser?.reviews || {},
        userIsFutureBookSelector: (state) =>
            state.loggedInUser?.id === FUTURE_BOOK_SELECTOR,
    },

    actions: {
        loginUser(userData: User) {
            this.loggedInUser = userData;
            setUserInStorage(userData);
        },

        logoutUser() {
            this.loggedInUser = {} as User;
            removeUserFromStorage();
        },

        setLoggedInUser(userData: User) {
            useLog().info(
                `Setting logged in user in store: ${userData.username}`
            );
            useLog().info(`Setting logged in user in store: ${userData.id}`);
            useLog().info(
                `Setting logged in user in store: ${userData.currentBookProgress}`
            );
            this.loggedInUser = userData;
            setUserInStorage(userData);
        },

        setFutureBookSelector(userData: User) {
            this.futureBookSelector = userData;
            this.futureBookSelectorUsername = userData.username;
        },

        updateUserProgress(progress: number) {
            if (this.loggedInUser) {
                this.loggedInUser.currentBookProgress = progress;
            }
        },

        setAllUsers(users: User[]) {
            this.allUsers = users;
        },
    },
});
