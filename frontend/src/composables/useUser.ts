import { usersService } from "@/services/users";
import type { Book, SubmitReviewArgs, User } from "@/types";
import { useUserStore } from "@/stores/user";
import { FINISHED_BOOK_PROGRESS } from "@/utils";
import { v4 as uuidv4 } from "uuid";

export const useUser = () => {
    const { loggedInUser, setLoggedInUser, setAllUsers } = useUserStore();

    const getUser = async (userId: string) => {
        const user = await usersService.getUser(userId);
        if (userId === loggedInUser.id) {
            setLoggedInUser(user);
        }
        return user;
    };

    const getUsers = async () => {
        const users = await usersService.getUsers();
        setAllUsers(users);
        return users;
    };

    const updateUser = async (userId: string, user: User) => {
        const updatedUser = await usersService.updateUser(userId, user);
        if (userId === loggedInUser.id) {
            setLoggedInUser(user);
        }
        return updatedUser;
    };

    const addReview = async (
        reviewArgs: SubmitReviewArgs,
        currentBook: Book
    ) => {
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
        const updatedUser = await updateUser(loggedInUser.id, {
            ...loggedInUser,
            currentBookProgress: FINISHED_BOOK_PROGRESS,
            reviews: {
                ...loggedInUser.reviews,
                [currentBook.id]: newReview,
            },
        });
        return updatedUser;
    };

    return {
        getUser,
        getUsers,
        updateUser,
        addReview,
    };
};
