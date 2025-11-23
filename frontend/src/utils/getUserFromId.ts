import { useUser } from "@/composables/useUser";
import { useUserStore } from "@/stores/user";

export const getUserFromId = async (userId: string) => {
    let { allUsers } = useUserStore();
    if (allUsers.length === 0) {
        await useUser().getUsers();
        allUsers = useUserStore().allUsers;
    }
    return allUsers.find((user) => user.id === userId);
};
