import type { User } from "./user";

export interface Review {
    id: string;
    book: {
        name: string;
        author: string;
    };
    rating: number;
    reviewComment: string;
}

export interface SubmitReviewArgs {
    rating: number;
    reviewComment: string;
}

export interface BroReview {
    reviewer: User;
    review: Review;
}
