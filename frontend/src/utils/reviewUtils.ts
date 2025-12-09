import type { User, Review } from "@/types";

export const getBookReview = (user: User, bookId: string) => {
    const reviews = Object.values(user.reviews);
    return reviews.find((review: Review) => review.book.id === bookId);
};

export const getReviewColor = (rating: number) => {
    const ratingValue = rating ?? 0;
    if (ratingValue <= 4) return "red";
    if (ratingValue <= 6) return "fuschia";
    if (ratingValue <= 8) return "blue";
    return "green";
};

export const getReviewThemeColor = (rating: number) => {
    const ratingValue = rating ?? 0;
    if (ratingValue <= 4) return "var(--accent-red)";
    if (ratingValue <= 6) return "var(--accent-fuschia)";
    if (ratingValue <= 8) return "var(--accent-blue)";
    return "var(--accent-green)";
};
