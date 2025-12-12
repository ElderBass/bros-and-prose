import type { User } from "./user";
import type { BookInfo } from "./books";

export interface Review {
    id: string;
    book: BookInfo;
    rating: number;
    reviewComment: string;
    createdAt: string;
    updatedAt?: string;
}

export interface SubmitReviewArgs {
    rating: number;
    reviewComment: string;
}

export interface BroReview {
    reviewer: User;
    review: Review;
}
