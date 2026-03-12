import type { User } from "@/types";

/**
 * Get the reading progress for a specific book on the currentlyReading shelf
 * @param user - The user object
 * @param bookId - The ID of the book
 * @returns The current page number, or 0 if no progress exists
 */
export const getBookProgress = (user: User, bookId: string): number => {
    return user.bookProgress?.[bookId] ?? 0;
};

/**
 * Update the reading progress for a specific book
 * @param user - The user object
 * @param bookId - The ID of the book
 * @param progress - The new page number
 * @returns A new user object with updated progress
 */
export const updateBookProgress = (
    user: User,
    bookId: string,
    progress: number
): User => {
    return {
        ...user,
        bookProgress: {
            ...user.bookProgress,
            [bookId]: progress,
        },
    };
};

/**
 * Remove progress tracking for a specific book
 * @param user - The user object
 * @param bookId - The ID of the book to remove
 * @returns A new user object with the book progress removed
 */
export const removeBookProgress = (user: User, bookId: string): User => {
    if (!user.bookProgress || !user.bookProgress[bookId]) {
        return user;
    }

    const { [bookId]: _, ...remainingProgress } = user.bookProgress;

    return {
        ...user,
        bookProgress: remainingProgress,
    };
};

/**
 * Check if a book has recorded progress
 * @param user - The user object
 * @param bookId - The ID of the book
 * @returns True if the book has progress recorded, false otherwise
 */
export const hasProgress = (user: User, bookId: string): boolean => {
    return user.bookProgress?.[bookId] !== undefined;
};
