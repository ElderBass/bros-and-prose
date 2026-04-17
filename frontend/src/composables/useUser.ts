import { usersService } from "@/services/users";
import type {
    Book,
    BookshelfBook,
    FutureBook,
    ProgressUpdateMetadata,
    ShelfAddMetadata,
    SubmitReviewArgs,
    User,
} from "@/types";
import { useUserStore } from "@/stores/user";
import {
    FINISHED_BOOK_PROGRESS,
    QUICK_ERROR,
    REVIEW_SUBMITTED_SUCCESS_ALERT,
} from "@/constants";
import { useUIStore } from "@/stores/ui";
import { useLog } from "./useLog";
import { useFutureBooks } from "./useFutureBooks";
import { buildReview, isReviewOfCurrentBook, sanitizeUser } from "@/utils";
import { storeToRefs } from "pinia";
import { usePalaver } from "./usePalaver";
import type { UserPatchMetadata } from "@/services/users";

export const useUser = () => {
    const { setLoggedInUser, setAllUsers, setFutureBookSelector } =
        useUserStore();

    const { loggedInUser } = storeToRefs(useUserStore());

    const { showAlert } = useUIStore();

    const getUser = async (userId: string) => {
        const user = await usersService.getUser(userId);
        const sanitizedUser = sanitizeUser(user);
        if (userId === loggedInUser.value.id) {
            setLoggedInUser(sanitizedUser);
        }
        return sanitizedUser;
    };

    const getUserByUsername = async (username: string) => {
        const user = await usersService.getUserByUsername(username);
        return user;
    };

    const getUsers = async (shouldMock: boolean = false) => {
        const users = await usersService.getUsers(shouldMock);
        setAllUsers(users);
        return users;
    };

    const getFutureBookSelector = async () => {
        const selector = await useFutureBooks().getCurrentSelector();
        setFutureBookSelector(selector);
        return selector;
    };

    const getOtherBros = async () => {
        const users = await usersService.getUsers();
        return users.filter((user) => user.id !== loggedInUser.value.id);
    };

    const updateUser = async (
        userId: string,
        user: User,
        metadata?: ShelfAddMetadata | ProgressUpdateMetadata
    ) => {
        const updatedUser = await usersService.updateUser(
            userId,
            user,
            metadata
        );
        const sanitizedUser = sanitizeUser(updatedUser);

        if (userId === loggedInUser.value.id) {
            setLoggedInUser(sanitizedUser);
        }
        return sanitizedUser;
    };

    const patchUser = async (
        userId: string,
        updates: Record<string, unknown>,
        metadata?: UserPatchMetadata
    ) => {
        const updatedUser = await usersService.patchUser(
            userId,
            updates,
            metadata
        );
        const sanitizedUser = sanitizeUser(updatedUser);

        if (userId === loggedInUser.value.id) {
            setLoggedInUser(sanitizedUser);
        }
        return sanitizedUser;
    };

    const updateUserProgress = async (userId: string, progress: number) => {
        try {
            const updatedUser = await patchUser(userId, {
                currentBookProgress: progress,
            });
            return updatedUser;
        } catch (error) {
            console.error("error in updateUserProgress", error);
            showAlert(
                QUICK_ERROR([
                    "oof, bud, this error happened: ",
                    (error as Error).message,
                ])
            );
            return null;
        }
    };

    const updateUserAvatar = async (userId: string, avatar: string) => {
        const updatedUser = await patchUser(userId, { avatar });
        return updatedUser;
    };

    const updateUserUsername = async (userId: string, username: string) => {
        const updatedUser = await patchUser(userId, { username });
        return updatedUser;
    };

    const addReview = async (
        reviewArgs: SubmitReviewArgs,
        book: Book | FutureBook | BookshelfBook
    ) => {
        try {
            const existingReview = loggedInUser.value?.reviews?.[book.id];
            const newReview = buildReview(reviewArgs, book, existingReview);

            await useLog().info(
                `newReview in addReview: reviewer = ${loggedInUser.value.username} | review = ${newReview}`
            );

            const reviewingCurrentBook = isReviewOfCurrentBook(book.id);

            const updates: Record<string, unknown> = {
                [`reviews/${book.id}`]: newReview,
            };
            if (reviewingCurrentBook) {
                updates.currentBookProgress = FINISHED_BOOK_PROGRESS;
            }

            const updatedUser = await patchUser(loggedInUser.value.id, updates);

            if (!existingReview && !reviewingCurrentBook) {
                await usePalaver().createPalaverEntryFromReview(newReview);
            }
            showAlert(REVIEW_SUBMITTED_SUCCESS_ALERT);
            return updatedUser;
        } catch (error) {
            console.error("error in addReview", error);
            await useLog().error(`Error in addReview: ${error}`);
            showAlert(
                QUICK_ERROR([
                    "oof, bud, this error happend: ",
                    (error as Error).message,
                ])
            );
            return null;
        }
    };

    return {
        getUser,
        getUserByUsername,
        getUsers,
        getFutureBookSelector,
        getOtherBros,
        updateUser,
        patchUser,
        updateUserAvatar,
        updateUserUsername,
        addReview,
        updateUserProgress,
    };
};
