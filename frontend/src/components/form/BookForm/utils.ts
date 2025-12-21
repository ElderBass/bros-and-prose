import type { BookFormMode, BookFormValues } from "./types";
import type { BookshelfBook, FutureBook } from "@/types";
import { isHaveReadShelf } from "@/utils";

export const showReviewForm = (mode: BookFormMode) => {
    return isHaveReadShelf() && mode === "add";
};

export const getInitialBookValues = (
    initialValues: Partial<BookFormValues>
) => {
    return {
        id: "",
        title: initialValues?.title ?? "",
        author: initialValues?.author ?? "",
        yearPublished: Number(initialValues?.yearPublished ?? 1969),
        pages: initialValues?.pages,
        tags: initialValues?.tags ?? [],
        description: initialValues?.description ?? "",
        imageSrc: initialValues?.imageSrc ?? "",
    } as BookshelfBook | FutureBook;
};
