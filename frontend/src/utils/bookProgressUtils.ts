import type { User } from "@/types";
import { FINISHED_BOOK_PROGRESS } from "@/constants";
import { convertToPercentage } from "./convertToPercentage";

export const getProgressString = (bro: User, totalPages: number) => {
    const broProgress = bro.currentBookProgress;
    if (broProgress === FINISHED_BOOK_PROGRESS || broProgress === totalPages) {
        return "finished";
    } else if (broProgress === 0) {
        return "lazy fuck hasn't started";
    }
    return `page ${broProgress} / ${totalPages} (${convertToPercentage(broProgress, totalPages)}%)`;
};

export const hasFinishedBook = (bro: User, totalPages: number) => {
    const broProgress = bro.currentBookProgress;
    return broProgress === FINISHED_BOOK_PROGRESS || broProgress === totalPages;
};
