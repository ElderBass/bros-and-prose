import type { BookshelfBook, User } from "@/types";
import { getUserShelves } from "./bookshelfUtils";

export const sanitizeUser = (user: User): User => {
    const { currentlyReading, haveRead, wantToRead } = getUserShelves(user);
    return {
        ...user,
        avatarType: user.avatarType || "icon", // Default to icon for existing users
        currentlyReading: sanitizeBookshelfBooks(currentlyReading),
        haveRead: sanitizeBookshelfBooks(haveRead),
        wantToRead: sanitizeBookshelfBooks(wantToRead),
    };
};

export const sanitizeBookshelfBooks = (books: BookshelfBook[]) => {
    return books
        .filter((book) => book?.id && book.id !== "placeholder")
        .map((book) => ({
            ...book,
            tags: Object.values(book.tags || {}),
        }));
};
