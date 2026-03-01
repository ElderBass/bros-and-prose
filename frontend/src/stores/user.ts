import { defineStore } from "pinia";
import type { User } from "@/types";
import {
    setUserInStorage,
    removeUserFromStorage,
    getUserFromStorage,
} from "@/utils";
import { useLog } from "@/composables/useLog";

export const useUserStore = defineStore("user", {
    state: () => ({
        loggedInUser: (getUserFromStorage() || ({} as User)) as User,
        allUsers: [] as User[],
        futureBookSelector: {} as User,
    }),

    getters: {
        isLoggedIn: (state) => !!state.loggedInUser,
        currentUserName: (state) =>
            state.loggedInUser
                ? `${state.loggedInUser.firstName} ${state.loggedInUser.lastName}`
                : "",
        currentUserReviews: (state) => state.loggedInUser?.reviews || {},
        userIsFutureBookSelector: (state) =>
            state.loggedInUser?.id === state.futureBookSelector.id,
        getUserByUsername: (state) => (username: string) =>
            state.allUsers.find((user) => user.username === username),
        getUserById: (state) => (id: string) =>
            state.allUsers.find((user) => user.id === id),
        allUsersExceptCurrent: (state) =>
            state.allUsers.filter(
                (user) => user.id !== state.loggedInUser?.id
            ) || [],
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
                `Setting logged in user in store: username = ${userData.username} id = ${userData.id} currentBookProgress = ${userData.currentBookProgress}`
            );
            this.loggedInUser = userData;
            setUserInStorage(userData);
        },

        updateUserProgress(progress: number) {
            if (this.loggedInUser) {
                this.loggedInUser.currentBookProgress = progress;
            }
        },

        setAllUsers(users: User[]) {
            this.allUsers = users;
        },

        setFutureBookSelector(selector: User) {
            this.futureBookSelector = selector;
        },
    },
});
