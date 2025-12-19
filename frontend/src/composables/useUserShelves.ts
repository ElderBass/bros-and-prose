import { useUser } from "./useUser";
import { useUserStore } from "@/stores/user";
import type { BookshelfBook, User, Shelf } from "@/types";
import { useLog } from "./useLog";
import { getUserShelves } from "@/utils/bookshelfUtils";
import { useShelfModalStore } from "@/stores/shelfModal";

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

            const updatedUser = await updateUser(loggedInUser.id, {
                ...loggedInUser,
                [shelf]: [...currentShelf, book],
            });

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

            const updatedUser = await updateUser(loggedInUser.id, {
                ...loggedInUser,
                [shelf]: updatedShelf,
            });
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
            "the present has now become past"
        );
        return updatedUser;
    };

    const addToWantToRead = async (
        book: BookshelfBook
    ): Promise<User | null> => {
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

    const addToHaveRead = async (book: BookshelfBook): Promise<User | null> => {
        const updatedUser = await addToShelf("haveRead", book);
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
    };
};
