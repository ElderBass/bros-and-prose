import type { User, Review } from "@/types";

export const getBookReview = (user: User, bookId: string) => {
    const reviews = Object.values(user.reviews);
    return reviews.find((review: Review) => review.book.id === bookId);
};

export const getReviewColor = (rating: number) => {
    const ratingValue = rating ?? 0;
    if (ratingValue <= 4) return "red";
    if (ratingValue <= 7) return "lavender";
    return "green";
};

export const getReviewThemeColor = (rating: number) => {
    const ratingValue = rating ?? 0;
    if (ratingValue <= 4) return "var(--accent-red)";
    if (ratingValue <= 7) return "var(--accent-lavender)";
    return "var(--accent-green)";
};
