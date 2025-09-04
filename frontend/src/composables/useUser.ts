import { usersService } from "@/services/users";
import type { User } from "@/types";
import { useUserStore } from "@/stores/user";

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

    return {
        getUser,
        getUsers,
        updateUser,
    };
};
