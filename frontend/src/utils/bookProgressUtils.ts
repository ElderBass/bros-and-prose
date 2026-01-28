import type {
    Book,
    BookshelfBook,
    FutureBook,
    SubmitReviewArgs,
    User,
} from "@/types";
import {
    BRO_NOT_STARTED,
    BRO_NOT_STARTED_MOBILE,
    FINISHED,
    FINISHED_BOOK_PROGRESS,
    FINISHED_MOBILE,
    RATING_MAP,
} from "@/constants";
import { convertToPercentage } from "./convertToPercentage";
import type { Review } from "@/types";
import { useDisplay } from "vuetify";
import { useBooksStore } from "@/stores/books";
import { v4 as uuidv4 } from "uuid";

export const getProgressString = (bro: User, totalPages: number) => {
    const { mobile } = useDisplay();
    const broProgress = bro.currentBookProgress;
    if (broProgress === FINISHED_BOOK_PROGRESS || broProgress === totalPages) {
        return mobile.value ? FINISHED_MOBILE : FINISHED;
    } else if (broProgress === 0) {
        return mobile.value ? BRO_NOT_STARTED_MOBILE : BRO_NOT_STARTED;
    }
    return `${!mobile.value ? "page" : ""} ${broProgress} / ${totalPages} (${convertToPercentage(broProgress, totalPages)}%)`;
};

export const getProgressPercentage = (current: number) => {
    if (current === FINISHED_BOOK_PROGRESS) {
        return 100;
    }
    const currentBook = useBooksStore().currentBook;
    return convertToPercentage(current, currentBook.totalPages);
};

export const getRatingReviewString = (broReview: Review, isMobile: boolean) => {
    let ratingReviewString = `${broReview.rating} / 10`;
    if (!isMobile) {
        ratingReviewString += ` - "${RATING_MAP[broReview.rating as keyof typeof RATING_MAP]}"`;
    }
    return ratingReviewString;
};

export const isReviewOfCurrentBook = (bookId: string) => {
    return bookId === useBooksStore().currentBook.id;
};

export const buildReview = (
    reviewArgs: SubmitReviewArgs,
    book: Book | FutureBook | BookshelfBook,
    existingReview?: Review
) => {
    const now = new Date().toISOString();

    // Edit semantics: preserve id/createdAt (and any other metadata), but set updatedAt.
    if (existingReview) {
        return {
            ...existingReview,
            rating: reviewArgs.rating,
            reviewComment: reviewArgs.reviewComment,
            updatedAt: now,
        };
    }

    return {
        id: uuidv4(),
        createdAt: now,
        book: {
            id: book.id,
            title: book.title,
            author: book.author,
        },
        rating: reviewArgs.rating,
        reviewComment: reviewArgs.reviewComment,
    };
};
