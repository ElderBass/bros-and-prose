import type { User, UserInfo } from "@/types";

export const getUserInfo = (user: User): UserInfo => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        avatarType: user.avatarType,
    };
};
