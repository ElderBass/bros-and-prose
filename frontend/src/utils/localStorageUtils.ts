import type { ProseDraft, User } from "@/types";

export const storage_key = "superCoolBroData";
export const guest_storage_key = "guest";
export const last_unread_palaver_entry_key = "lastUnreadPalaverEntry";
export const last_unread_prose_entry_key = "lastUnreadProseEntry";
export const prose_draft_key = "proseDraft";
const prose_comment_draft_key_prefix = "proseCommentDraft";

export type ProseCommentDraft = {
    text: string;
    replyContext?: {
        commentId: string;
        username: string;
        text: string;
    };
    savedAt: string;
};

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

export const getLastUnreadProseEntry = (): {
    entryId?: string;
    date?: string;
} => {
    const raw = localStorage.getItem(last_unread_prose_entry_key);
    return raw ? JSON.parse(raw) : {};
};

export const setLastUnreadProseEntry = (entryId: string, date: string) => {
    localStorage.setItem(
        last_unread_prose_entry_key,
        JSON.stringify({ entryId, date })
    );
};

export const getProseDraft = (): ProseDraft | null => {
    try {
        const draft = localStorage.getItem(prose_draft_key);
        if (!draft) return null;
        return JSON.parse(draft) as ProseDraft;
    } catch {
        return null;
    }
};

export const setProseDraft = (draft: ProseDraft) => {
    localStorage.setItem(prose_draft_key, JSON.stringify(draft));
};

export const clearProseDraft = () => {
    localStorage.removeItem(prose_draft_key);
};

const getProseCommentDraftKey = (entryId: string, userId: string) =>
    `${prose_comment_draft_key_prefix}:${userId}:${entryId}`;

export const getProseCommentDraft = (
    entryId: string,
    userId: string
): ProseCommentDraft | null => {
    try {
        const key = getProseCommentDraftKey(entryId, userId);
        const draft = localStorage.getItem(key);
        if (!draft) return null;
        return JSON.parse(draft) as ProseCommentDraft;
    } catch {
        return null;
    }
};

export const setProseCommentDraft = (
    entryId: string,
    userId: string,
    draft: ProseCommentDraft
) => {
    const key = getProseCommentDraftKey(entryId, userId);
    localStorage.setItem(key, JSON.stringify(draft));
};

export const clearProseCommentDraft = (entryId: string, userId: string) => {
    const key = getProseCommentDraftKey(entryId, userId);
    localStorage.removeItem(key);
};
