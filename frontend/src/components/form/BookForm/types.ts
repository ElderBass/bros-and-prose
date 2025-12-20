import type { BookshelfBook } from "@/types";

export type BookFormMode = "add" | "edit" | "future" | "future-edit";

export type BookFormValues = {
    title: string;
    author: string;
    yearPublished: string;
    pages?: number;
    tags: string[];
    description: string;
    imageSrc?: string;
};

export type BookFormValidation = {
    requireTitle?: boolean;
    requireAuthor?: boolean;
    requireYearPublished?: boolean;
    requireTags?: boolean;
    requireDescription?: boolean;
};

export type BookFormSearchResult = BookshelfBook;
