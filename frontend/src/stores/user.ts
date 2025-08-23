import { ref } from "vue";
import { defineStore } from "pinia";

interface User {
    id: number | null;
    name: string | null;
    email: string | null;
    isLoggedIn: boolean;
    currentBookProgress: number | null;
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

export const useUserStore = defineStore("user", () => {
    const user = ref<User>({
        id: null,
        name: null,
        email: null,
        isLoggedIn: false,
        currentBookProgress: null,
        reviews: [],
    });

    const loginUser = (userData: User) => {
        user.value = {
            ...userData,
            isLoggedIn: true,
        };
    };

    const logoutUser = () => {
        user.value = {
            id: null,
            name: null,
            email: null,
            isLoggedIn: false,
            currentBookProgress: null,
            reviews: [],
        };
    };

    const setUserReviews = (reviews: any[]) => {
        user.value.reviews = reviews;
    };

    return { user, loginUser, logoutUser, setUserReviews };
});
