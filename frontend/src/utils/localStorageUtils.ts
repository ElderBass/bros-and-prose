import type { User } from "@/types";

export const storage_key = "superCoolBroData";
export const guest_storage_key = "guest";
export const last_unread_palaver_entry_key = "lastUnreadPalaverEntry";

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

export const setGuestUser = () => {
    localStorage.setItem(guest_storage_key, "true");
};

export const isGuestUser = () => {
    return localStorage.getItem(guest_storage_key) === "true";
};

export const getLastUnreadPalaverEntry = () => {
    return localStorage.getItem(last_unread_palaver_entry_key);
};

export const setLastUnreadPalaverEntry = (entryId: string) => {
    localStorage.setItem(last_unread_palaver_entry_key, entryId);
};
