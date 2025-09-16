import type { User } from "@/types";
import {
    BRO_NOT_STARTED,
    FINISHED,
    FINISHED_BOOK_PROGRESS,
    RATING_MAP,
} from "@/constants";
import { convertToPercentage } from "./convertToPercentage";
import type { Review } from "@/types";

export const getProgressString = (bro: User, totalPages: number) => {
    const broProgress = bro.currentBookProgress;
    if (broProgress === FINISHED_BOOK_PROGRESS || broProgress === totalPages) {
        return FINISHED;
    } else if (broProgress === 0) {
        return BRO_NOT_STARTED;
    }
    return `page ${broProgress} / ${totalPages} (${convertToPercentage(broProgress, totalPages)}%)`;
};

export const getRatingReviewString = (broReview: Review, isMobile: boolean) => {
    let ratingReviewString = `${broReview.rating} / 10`;
    if (!isMobile) {
        ratingReviewString += ` - "${RATING_MAP[broReview.rating as keyof typeof RATING_MAP]}"`;
    }
    return ratingReviewString;
};

export const hasFinishedBook = (bro: User, totalPages: number) => {
    const broProgress = bro.currentBookProgress;
    return broProgress === FINISHED_BOOK_PROGRESS || broProgress === totalPages;
};
