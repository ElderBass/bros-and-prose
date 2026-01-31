import type { BookshelfBook } from "@/types";

const sortBooksAsc = (books: BookshelfBook[]) => {
    return books.sort((a, b) => {
        if (a.dateAdded && b.dateAdded) {
            return a.dateAdded.localeCompare(b.dateAdded);
        }
        return a.title.localeCompare(b.title);
    });
};

const sortBooksDesc = (books: BookshelfBook[]) => {
    return books.sort((a, b) => {
        if (a.dateAdded && b.dateAdded) {
            return b.dateAdded.localeCompare(a.dateAdded);
        }
        return b.title.localeCompare(a.title);
    });
};

export const sortBooks = (
    books: BookshelfBook[],
    sortOrder: "asc" | "desc" = "asc"
) => {
    if (sortOrder === "asc") {
        return sortBooksAsc(books);
    }
    return sortBooksDesc(books);
};
