import type { BookshelfBook, FutureBook } from "@/types";

export type BookFormMode = "add" | "edit" | "future" | "future-edit";

export type BookFormValues = BookshelfBook | FutureBook;

export type BookFormValidation = {
    requireTags?: boolean;
    requireDescription?: boolean;
};

export type BookFormSearchResult = BookshelfBook;
