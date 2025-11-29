import { usersService } from "@/services/users";
import type { Book, SubmitReviewArgs, User } from "@/types";
import { useUserStore } from "@/stores/user";
import {
    FINISHED_BOOK_PROGRESS,
    QUICK_ERROR,
    REVIEW_SUBMITTED_SUCCESS_ALERT,
} from "@/constants";
import { v4 as uuidv4 } from "uuid";
import { useUIStore } from "@/stores/ui";
import { useLog } from "./useLog";
import { useFutureBooks } from "./useFutureBooks";

export const useUser = () => {
    const {
        loggedInUser,
        setLoggedInUser,
        setAllUsers,
        setFutureBookSelector,
    } = useUserStore();

    const { showAlert } = useUIStore();

    const getUser = async (userId: string) => {
        const user = await usersService.getUser(userId);
        if (userId === loggedInUser.id) {
            setLoggedInUser(user);
        }
        return user;
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
        return users.filter((user) => user.id !== loggedInUser.id);
    };

    const updateUser = async (userId: string, user: User) => {
        const updatedUser = await usersService.updateUser(userId, user);
        if (userId === loggedInUser.id) {
            setLoggedInUser(user);
        }
        return updatedUser;
    };

    const updateUserProgress = async (userId: string, progress: number) => {
        try {
            const updatedUser = await usersService.updateUser(userId, {
                ...loggedInUser,
                currentBookProgress: progress,
            });
            if (userId === loggedInUser.id) {
                setLoggedInUser(updatedUser);
            }
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
        const updatedUser = await updateUser(userId, {
            ...loggedInUser,
            avatar,
        });
        return updatedUser;
    };

    const updateUserUsername = async (userId: string, username: string) => {
        const updatedUser = await updateUser(userId, {
            ...loggedInUser,
            username,
        });
        return updatedUser;
    };

    const addReview = async (
        reviewArgs: SubmitReviewArgs,
        currentBook: Book
    ) => {
        try {
            const newReview = {
                id: uuidv4(),
                book: {
                    id: currentBook.id,
                    name: currentBook.title,
                    author: currentBook.author,
                },
                rating: reviewArgs.rating,
                reviewComment: reviewArgs.reviewComment,
            };
            await useLog().info(
                `newReview in addReview: reviewer = ${loggedInUser.username} | review = ${newReview}`
            );
            const updatedUser = await updateUser(loggedInUser.id, {
                ...loggedInUser,
                currentBookProgress: FINISHED_BOOK_PROGRESS,
                reviews: {
                    ...loggedInUser.reviews,
                    [currentBook.id]: newReview,
                },
            });
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
        updateUserAvatar,
        updateUserUsername,
        addReview,
        updateUserProgress,
    };
};
