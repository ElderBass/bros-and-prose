import { usersService } from "@/services/users";
import { useUserStore } from "@/stores/user";
import type { FutureBook, User } from "@/types";
import { useLog } from "./useLog";
import { getUserShelves } from "@/utils/bookshelfUtils";

export const useUserShelves = () => {
    const { info, error: logError } = useLog();

    const updateCurrentlyReading = async (
        book: FutureBook
    ): Promise<User | null> => {
        const loggedInUser = useUserStore().loggedInUser;
        console.log("KERTWANGING updateCurrentlyReading", book);
        const updatedUser = await updateUser({
            ...loggedInUser,
            currentlyReading: book,
        });
        return updatedUser;
    };

    const addToShelf = async (
        shelf: "wantToRead" | "haveRead",
        book: FutureBook
    ): Promise<User | null> => {
        try {
            const loggedInUser = useUserStore().loggedInUser;

            const currentShelf = getUserShelves(loggedInUser)[shelf];

            const updatedUser = await updateUser({
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

    const removeFromShelf = async (
        shelf: "wantToRead" | "haveRead",
        bookId: string
    ): Promise<User | null> => {
        try {
            const loggedInUser = useUserStore().loggedInUser;
            const currentShelf = getUserShelves(loggedInUser)[shelf];
            const updatedShelf = currentShelf.filter((b) => b.id !== bookId);

            const updatedUser = await updateUser({
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

    const addToWantToRead = async (book: FutureBook): Promise<User | null> => {
        const updatedUser = await addToShelf("wantToRead", book);
        return updatedUser;
    };

    const removeFromWantToRead = async (
        bookId: string
    ): Promise<User | null> => {
        const updatedUser = await removeFromShelf("wantToRead", bookId);
        return updatedUser;
    };

    const addToHaveRead = async (book: FutureBook): Promise<User | null> => {
        const updatedUser = await addToShelf("haveRead", book);
        return updatedUser;
    };

    const removeFromHaveRead = async (bookId: string): Promise<User | null> => {
        const updatedUser = await removeFromShelf("haveRead", bookId);
        return updatedUser;
    };

    const moveFromWantToReadToHaveRead = async (
        book: FutureBook
    ): Promise<User | null> => {
        await removeFromShelf("wantToRead", book.id);
        const updatedUser = await addToShelf("haveRead", book);
        return updatedUser;
    };

    const updateWantToRead = async (
        bookId: string,
        updatedBook: FutureBook
    ): Promise<User | null> => {
        try {
            const loggedInUser = useUserStore().loggedInUser;
            const currentWantToRead = getUserShelves(loggedInUser).wantToRead;
            const updatedWantToRead = currentWantToRead.map((b) =>
                b.id === bookId ? updatedBook : b
            );

            const updatedUser = await updateUser({
                ...loggedInUser,
                wantToRead: updatedWantToRead,
            });

            await info(
                `Updated book ${updatedBook.title} in wantToRead for ${loggedInUser.username}`
            );
            return updatedUser;
        } catch (err) {
            console.error("error in updateWantToRead", err);
            await logError(`Error updating wantToRead: ${err}`);
            throw new Error(`Error updating wantToRead: ${err}`);
        }
    };

    const updateHaveRead = async (
        bookId: string,
        updatedBook: FutureBook
    ): Promise<User | null> => {
        try {
            const loggedInUser = useUserStore().loggedInUser;
            const currentHaveRead = getUserShelves(loggedInUser).haveRead;
            const updatedHaveRead = currentHaveRead.map((b) =>
                b.id === bookId ? updatedBook : b
            );

            const updatedUser = await updateUser({
                ...loggedInUser,
                haveRead: updatedHaveRead,
            });

            await info(
                `Updated book ${updatedBook.title} in haveRead for ${loggedInUser.username}`
            );
            return updatedUser;
        } catch (err) {
            console.error("error in updateHaveRead", err);
            await logError(`Error updating haveRead: ${err}`);
            throw new Error(`Error updating haveRead: ${err}`);
        }
    };

    const updateUser = async (user: User) => {
        const updatedUser = await usersService.updateUser(user.id, user);
        useUserStore().setLoggedInUser(updatedUser);
        return updatedUser;
    };

    return {
        updateCurrentlyReading,
        addToWantToRead,
        removeFromWantToRead,
        addToHaveRead,
        removeFromHaveRead,
        moveFromWantToReadToHaveRead,
        updateWantToRead,
        updateHaveRead,
    };
};
