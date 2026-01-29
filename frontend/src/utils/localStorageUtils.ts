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

export const setGuestUser = (isGuest: boolean) => {
    localStorage.setItem(guest_storage_key, isGuest ? "true" : "false");
};

export const isGuestUser = () => {
    const guest = localStorage.getItem(guest_storage_key);
    const loggedIn = getUserFromStorage();
    if (!loggedIn?.id && !guest) {
        return true;
    }
    return guest === "true";
};

export const getLastUnreadPalaverEntry = () => {
    const lastUnreadEntry = localStorage.getItem(last_unread_palaver_entry_key);
    return lastUnreadEntry ? JSON.parse(lastUnreadEntry) : {};
};

export const setLastUnreadPalaverEntry = (entryId: string, date: string) => {
    localStorage.setItem(
        last_unread_palaver_entry_key,
        JSON.stringify({ entryId, date })
    );
};
