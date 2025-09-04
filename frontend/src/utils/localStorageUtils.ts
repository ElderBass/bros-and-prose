import type { User } from "@/types";

export const storage_key = "superCoolBroData";

export const setUserInStorage = (user: User) => {
    localStorage.setItem(storage_key, JSON.stringify(user));
};

export const getUserFromStorage = () => {
    const user = localStorage.getItem(storage_key);
    return user ? JSON.parse(user) : null;
};

export const removeUserFromStorage = () => {
    localStorage.removeItem(storage_key);
};
