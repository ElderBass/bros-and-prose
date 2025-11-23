import { useUser } from "@/composables/useUser";
import { EMPTY_REVIEW } from "@/constants";
import { useUserStore } from "@/stores/user";
import type { Book, BroReview, Comment } from "@/types";
import { getUserInfo } from "./getUserInfo";
import { v4 as uuidv4 } from "uuid";

export const getReviewsAndAverageRating = async (book: Book) => {
    const reviews = await getUserReviews(book);
    const averageRating = getAverageRating(reviews);
    return { reviews, averageRating };
};

const getUserReviews = async (book: Book) => {
    let { allUsers } = useUserStore();
    if (allUsers.length === 0) {
        await useUser().getUsers();
        allUsers = useUserStore().allUsers;
    }
    return allUsers.map((user) => ({
        reviewer: user,
        review: (user.reviews && user.reviews[book.id]) || EMPTY_REVIEW,
    }));
};

const getAverageRating = (userReviews: BroReview[]) => {
    let numberOfReviews = 0;
    return (
        userReviews.reduce((acc, review) => {
            if (review.review.rating !== 0) {
                numberOfReviews++;
                return acc + review.review.rating;
            }
            return acc;
        }, 0) / numberOfReviews
    ).toFixed(1);
};

export const buildComment = (commentText: string): Comment => {
    const user = useUserStore().loggedInUser;
    const userInfo = getUserInfo(user);
    return {
        id: uuidv4(),
        user: userInfo,
        comment: commentText,
        createdAt: new Date().toISOString(),
    };
};
