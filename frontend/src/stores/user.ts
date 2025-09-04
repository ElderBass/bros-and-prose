import { defineStore } from "pinia";
import type { User } from "@/types";
import { setUserInStorage, removeUserFromStorage } from "@/utils";

export const useUserStore = defineStore("user", {
    state: () => ({
        loggedInUser: {} as User,
        allUsers: [] as User[],
    }),

    getters: {
        isLoggedIn: (state) => !!state.loggedInUser,
        currentUserName: (state) =>
            state.loggedInUser
                ? `${state.loggedInUser.firstName} ${state.loggedInUser.lastName}`
                : "",
        currentUserReviews: (state) => state.loggedInUser?.reviews || [],
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
    },
});
