import { useUserStore } from "@/stores/user";

export const hasAdminPrivileges = () => {
    const { loggedInUser } = useUserStore();
    return loggedInUser.role === "admin";
};
