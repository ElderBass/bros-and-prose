import { ref } from "vue";
import { defineStore } from "pinia";

interface UserState {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isLoggedIn: boolean;
    currentBookProgress: number;
    reviews: Review[];
}

interface Review {
    id: number;
    book: {
        name: string;
        author: string;
    };
    rating: number;
    reviewComment: string;
}

const initialState: UserState = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    isLoggedIn: false,
    currentBookProgress: 0,
    reviews: [],
};

export const useUserStore = defineStore("user", () => {
    const user = ref<UserState>(initialState);

    const loginUser = (userData: UserState) => {
        user.value = {
            ...userData,
            isLoggedIn: true,
        };
    };

    const logoutUser = () => {
        user.value = {
            ...initialState,
        };
    };

    const setUserReviews = (reviews: any[]) => {
        user.value.reviews = reviews;
    };

    return { user, loginUser, logoutUser, setUserReviews };
});
