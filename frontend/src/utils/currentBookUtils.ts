import { useBooksStore } from "@/stores/books";
import type { PalaverEntry } from "@/types";

export const isCurrentBookReview = (entry: PalaverEntry) => {
    return (
        entry.type === "review" &&
        entry.bookInfo?.id === useBooksStore().currentBook.id
    );
};

export const canShowCurrentBookReview = (entry: PalaverEntry) => {
    if (isCurrentBookReview(entry)) {
        return useBooksStore().getCurrentBook.completed;
    }
    return true;
};

export const maybeShowCurrentBookReview = (entry: PalaverEntry) => {
    if (isCurrentBookReview(entry)) {
        return canShowCurrentBookReview(entry);
    }
    return true;
};
