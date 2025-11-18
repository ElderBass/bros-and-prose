import { EMPTY_REVIEW } from "@/constants";
import { useUserStore } from "@/stores/user";
import type { Book, BroReview } from "@/types";

export const getReviewsAndAverageRating = (book: Book) => {
    const reviews = getUserReviews(book);
    const averageRating = getAverageRating(reviews);
    return { reviews, averageRating };
};

const getUserReviews = (book: Book) => {
    const { allUsers } = useUserStore();
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
