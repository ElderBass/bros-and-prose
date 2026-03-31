import { useUser } from "./useUser";
import { useUserStore } from "@/stores/user";
import type {
    BookshelfBook,
    User,
    Shelf,
    SubmitReviewArgs,
    Book,
    ShelfAddMetadata,
} from "@/types";
import { useLog } from "./useLog";
import {
    buildShelfAddMetadata,
    convertBookToBookshelfBook,
    getShelfBookIsOn,
    getUserShelves,
} from "@/utils";
import { useShelfModalStore } from "@/stores/shelfModal";

const SHELF_ADD_METADATA_UPDATE_TYPES = ["currentlyReading", "wantToRead"];

export const useUserShelves = () => {
    const { info, error: logError } = useLog();
    const { updateUser } = useUser();

    const addToShelf = async (
        shelf: Shelf,
        book: BookshelfBook
    ): Promise<User | null> => {
        try {
            const loggedInUser = useUserStore().loggedInUser;

            const currentShelf = getUserShelves(loggedInUser)[shelf];

            let metadata = undefined;

            if (SHELF_ADD_METADATA_UPDATE_TYPES.includes(shelf)) {
                metadata = buildShelfAddMetadata(book, shelf);
            }

            const updatedUser = await updateUser(
                loggedInUser.id,
                {
                    ...loggedInUser,
                    [shelf]: [...currentShelf, book],
                },
                metadata as ShelfAddMetadata
            );

            await info(
                `Added ${book.title} to ${shelf} for ${loggedInUser.username}`
            );
            return updatedUser;
        } catch (err) {
            console.error("error in addToShelf", err);
            await logError(`Error adding to ${shelf}: ${err}`);
            throw new Error(`Error adding to ${shelf}: ${err}`);
        }
    };

    const updateBookOnShelf = async (
        shelf: Shelf,
        updatedBook: BookshelfBook
    ): Promise<User | null> => {
        try {
            const loggedInUser = useUserStore().loggedInUser;
            const currentShelf = getUserShelves(loggedInUser)[shelf];
            const updatedShelf = currentShelf.map((b) =>
                b.id === updatedBook.id ? updatedBook : b
            );
            const updatedUser = await updateUser(loggedInUser.id, {
                ...loggedInUser,
                [shelf]: updatedShelf,
            });
            await info(
                `Updated book ${updatedBook.title} on ${shelf} for ${loggedInUser.username}`
            );
            return updatedUser;
        } catch (err) {
            console.error("error in updateBookOnShelf", err);
            await logError(`Error updating book on ${shelf}: ${err}`);
            throw new Error(`Error updating book on ${shelf}: ${err}`);
        }
    };

    const removeFromShelf = async (
        shelf: Shelf,
        bookId: string
    ): Promise<User | null> => {
        try {
            const loggedInUser = useUserStore().loggedInUser;
            const currentShelf = getUserShelves(loggedInUser)[shelf];
            const updatedShelf = currentShelf.filter((b) => b.id !== bookId);

            // Prepare updated user data
            const updatedUserData: Partial<User> = {
                ...loggedInUser,
                [shelf]: updatedShelf,
            };

            // Clean up progress if removing from currentlyReading
            if (
                shelf === "currentlyReading" &&
                loggedInUser.bookProgress?.[bookId]
            ) {
                const { [bookId]: _, ...remainingProgress } =
                    loggedInUser.bookProgress;
                updatedUserData.bookProgress = remainingProgress;
            }

            const updatedUser = await updateUser(
                loggedInUser.id,
                updatedUserData as User
            );
            await info(
                `Removed book ${bookId} from ${shelf} for ${loggedInUser.username}`
            );
            return updatedUser;
        } catch (err) {
            console.error("error in removeFromShelf", err);
            await logError(`Error removing from ${shelf}: ${err}`);
            throw new Error(`Error removing from ${shelf}: ${err}`);
        }
    };

    const addToCurrentlyReading = async (
        book: BookshelfBook
    ): Promise<User | null> => {
        const updatedUser = await addToShelf("currentlyReading", book);
        return updatedUser;
    };

    const finishCurrentlyReading = async (
        bookId: string
    ): Promise<User | null> => {
        const loggedInUser = useUserStore().loggedInUser;
        const currentBook = loggedInUser.currentlyReading?.find(
            (b) => b.id === bookId
        );
        if (!currentBook) {
            console.error("Current book not found");
            return null;
        }

        const updatedUser = await removeFromShelf(
            "currentlyReading",
            currentBook.id
        );

        if (currentBook?.id) {
            await addToShelf("haveRead", currentBook);
        }
        useShelfModalStore().openBookActionSuccess(
            "add",
            currentBook as BookshelfBook,
            "haveRead",
            "the present has now become past",
            true
        );
        return updatedUser;
    };

    const addToWantToRead = async (
        book: BookshelfBook
    ): Promise<User | null> => {
        const shelf = getShelfBookIsOn(book);
        if (shelf && shelf !== "wantToRead") {
            await removeFromShelf(shelf as Shelf, book.id);
        }
        const updatedUser = await addToShelf("wantToRead", book);
        return updatedUser;
    };

    const removeFromWantToRead = async (
        bookId: string
    ): Promise<User | null> => {
        const updatedUser = await removeFromShelf("wantToRead", bookId);
        return updatedUser;
    };

    const removeFromCurrentlyReading = async (
        bookId: string
    ): Promise<User | null> => {
        const updatedUser = await removeFromShelf("currentlyReading", bookId);
        return updatedUser;
    };

    const addToHaveRead = async (
        book: BookshelfBook,
        review?: SubmitReviewArgs
    ): Promise<User | null> => {
        const updatedUser = await addToShelf("haveRead", book);
        if (review) {
            await useUser().addReview(review, book);
        }
        return updatedUser;
    };

    const removeFromHaveRead = async (bookId: string): Promise<User | null> => {
        const updatedUser = await removeFromShelf("haveRead", bookId);
        return updatedUser;
    };

    const moveFromWantToReadToHaveRead = async (
        book: BookshelfBook
    ): Promise<User | null> => {
        await removeFromShelf("wantToRead", book.id);
        const updatedUser = await addToShelf("haveRead", book);
        return updatedUser;
    };

    const moveFromWantToReadToCurrentlyReading = async (
        book: BookshelfBook
    ): Promise<User | null> => {
        await removeFromShelf("wantToRead", book.id);
        const updatedUser = await addToCurrentlyReading(book);
        return updatedUser;
    };

    const updateCurrentlyReading = async (
        updatedBook: BookshelfBook
    ): Promise<User | null> => {
        const updatedUser = await updateBookOnShelf(
            "currentlyReading",
            updatedBook
        );
        return updatedUser;
    };

    const updateWantToRead = async (
        updatedBook: BookshelfBook
    ): Promise<User | null> => {
        const updatedUser = await updateBookOnShelf("wantToRead", updatedBook);
        return updatedUser;
    };

    const updateHaveRead = async (
        updatedBook: BookshelfBook
    ): Promise<User | null> => {
        const updatedUser = await updateBookOnShelf("haveRead", updatedBook);
        return updatedUser;
    };

    const addCurrentBookClubBookToHaveRead = async (
        book: Book,
        tags?: string[]
    ): Promise<User | null> => {
        try {
            const loggedInUser = useUserStore().loggedInUser;
            const bookshelfBook = convertBookToBookshelfBook(book, tags);

            // Check if book exists on other shelves
            const existsOnCurrentlyReading =
                loggedInUser.currentlyReading?.some(
                    (b) => b.id === bookshelfBook.id
                );
            const existsOnWantToRead = loggedInUser.wantToRead?.some(
                (b) => b.id === bookshelfBook.id
            );

            // Remove from Currently Reading if present
            if (existsOnCurrentlyReading) {
                await removeFromShelf("currentlyReading", bookshelfBook.id);
            }

            // Remove from Want to Read if present
            if (existsOnWantToRead) {
                await removeFromShelf("wantToRead", bookshelfBook.id);
            }

            // Check if already on Have Read to avoid duplicates
            const existsOnHaveRead = loggedInUser.haveRead?.some(
                (b) => b.id === bookshelfBook.id
            );

            if (!existsOnHaveRead) {
                await addToShelf("haveRead", bookshelfBook);
            }

            await info(
                `Added current book club book "${book.title}" to Have Read for ${loggedInUser.username}`
            );

            return loggedInUser;
        } catch (err) {
            console.error("error in addCurrentBookClubBookToHaveRead", err);
            await logError(
                `Error adding current book club book to Have Read: ${err}`
            );
            throw new Error(
                `Error adding current book club book to Have Read: ${err}`
            );
        }
    };

    const updateShelfBookProgress = async (
        bookId: string,
        progress: number
    ): Promise<User | null> => {
        try {
            const loggedInUser = useUserStore().loggedInUser;

            const updatedBookProgress = {
                ...loggedInUser.bookProgress,
                [bookId]: progress,
            };

            const updatedUser = await updateUser(loggedInUser.id, {
                ...loggedInUser,
                bookProgress: updatedBookProgress,
            });

            await info(
                `Updated progress for book ${bookId} to page ${progress} for ${loggedInUser.username}`
            );
            return updatedUser;
        } catch (err) {
            console.error("error in updateShelfBookProgress", err);
            await logError(`Error updating shelf book progress: ${err}`);
            throw new Error(`Error updating shelf book progress: ${err}`);
        }
    };

    return {
        addToCurrentlyReading,
        finishCurrentlyReading,
        addToWantToRead,
        removeFromCurrentlyReading,
        removeFromWantToRead,
        addToHaveRead,
        removeFromHaveRead,
        moveFromWantToReadToHaveRead,
        moveFromWantToReadToCurrentlyReading,
        updateCurrentlyReading,
        updateWantToRead,
        updateHaveRead,
        addCurrentBookClubBookToHaveRead,
        updateShelfBookProgress,
    };
};
