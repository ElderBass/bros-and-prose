import type { User } from "@/types";

export const getUserInfo = (user: User) => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
    };
};
