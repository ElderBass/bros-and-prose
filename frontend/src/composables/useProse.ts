import { ref, onValue, off, type DataSnapshot } from "firebase/database";
import { getFirebase } from "@/setup/firebaseClient";
import { proseService } from "@/services";
import { useProseStore } from "@/stores/prose";
import { useUserStore } from "@/stores/user";
import type {
    Comment,
    EmojiReactionKey,
    ProseEntry,
    ProseEntryMetadata,
} from "@/types";
import { checkForUnreadProseEntries } from "@/utils/proseUtils";
import {
    getEmojiReactionOption,
    getMentionedUsers,
    toggleEmojiReaction,
} from "@/utils";
import { useLog } from "./useLog";

let unsubscribe: (() => void) | null = null;

const sortProseEntries = (entries: ProseEntry[]) => {
    return entries
        .map((entry) => ({
            ...entry,
            comments: [...(entry.comments || [])].sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
            ),
        }))
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
};

const getMentionMetadata = (text: string) => {
    const currentUserId = useUserStore().loggedInUser?.id;
    const allUsers = useUserStore().allUsers;
    const mentionedUsers = getMentionedUsers(text, allUsers)
        .filter((user) => user.id !== currentUserId)
        .map((user) => ({ username: user.username, email: user.email }));

    return mentionedUsers.length > 0 ? mentionedUsers : undefined;
};

const buildCreateMetadata = (entry: ProseEntry): ProseEntryMetadata => {
    const text = entry.excerpt || entry.markdown.slice(0, 240) + "...";
    return {
        username: entry.userInfo.username,
        proseTitle: entry.title,
        text,
        updateType: "prose_created",
        mentionedUsers: getMentionMetadata(text),
    };
};

const buildReactionMetadata = (
    proseEntry: ProseEntry,
    target: ProseEntry | Comment,
    updateType:
        | "prose_like"
        | "prose_dislike"
        | "prose_reaction"
        | "prose_comment",
    reactionKey?: EmojiReactionKey
): ProseEntryMetadata => {
    const commentText =
        updateType === "prose_comment" && "text" in target
            ? target.text
            : undefined;
    const reaction = reactionKey
        ? getEmojiReactionOption(reactionKey)
        : undefined;

    return {
        username: useUserStore().loggedInUser.username,
        proseTitle: proseEntry.title,
        targetUsername: target.userInfo.username,
        targetUserEmail: target.userInfo.email,
        updateType,
        reactionKey,
        reactionEmoji: reaction?.emoji,
        text: commentText,
        mentionedUsers: commentText
            ? getMentionMetadata(commentText)
            : undefined,
    };
};

const buildReplyMetadata = (
    proseEntry: ProseEntry,
    reply: Comment
): ProseEntryMetadata => {
    const originalComment = proseEntry.comments?.find(
        (comment) => comment.id === reply.replyToId
    );

    return {
        username: useUserStore().loggedInUser.username,
        proseTitle: proseEntry.title,
        targetUsername: reply.replyToUsername || "unknown",
        targetUserEmail: originalComment?.userInfo.email || "",
        updateType: "prose_reply",
        text: reply.text,
        replyToText: reply.replyToText,
        mentionedUsers: getMentionMetadata(reply.text),
    };
};

export function subscribeToProse() {
    if (unsubscribe) return;
    const { db } = getFirebase();
    const proseRef = ref(db, "prose");

    const handler = (snapshot: DataSnapshot) => {
        const value = snapshot.val() ?? {};
        const list = Object.values(value).filter(
            (item: unknown) => (item as ProseEntry).id
        ) as ProseEntry[];
        const sorted = sortProseEntries(list);
        const store = useProseStore();
        store.setEntries(sorted);
        checkForUnreadProseEntries(sorted, (v) =>
            store.setHasUnreadProseEntries(v)
        );
    };

    onValue(proseRef, handler, (error) => {
        console.error("Error subscribing to prose:", error);
    });
    unsubscribe = () => off(proseRef, "value", handler);
}

export function unsubscribeFromProse() {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
}

export const useProse = () => {
    const proseStore = useProseStore();
    const { info } = useLog();

    const getProseEntries = async (isInit = false) => {
        const response = await proseService.list();
        if (response.success) {
            const sortedEntries = sortProseEntries(response.data);
            proseStore.setEntries(sortedEntries);
            checkForUnreadProseEntries(sortedEntries, (v) =>
                proseStore.setHasUnreadProseEntries(v)
            );
            if (isInit) {
                subscribeToProse();
            }
            return sortedEntries;
        }
        return [];
    };

    const getProseEntry = async (entryId: string) => {
        const response = await proseService.get(entryId);
        if (response.success) {
            return response.data;
        }
        return null;
    };

    const createProseEntry = async (
        entry: ProseEntry,
        metadata?: ProseEntryMetadata
    ) => {
        const payloadMetadata = metadata || buildCreateMetadata(entry);
        const response = await proseService.create({
            entry,
            metadata: payloadMetadata,
        });
        if (response.success) {
            await info(`Created prose entry: ${entry.id}`);
        }
        return response.data;
    };

    const updateProseEntry = async (
        entry: ProseEntry,
        metadata?: ProseEntryMetadata
    ) => {
        const response = await proseService.update({
            entry: {
                ...entry,
                updatedAt: new Date().toISOString(),
            },
            metadata,
        });
        if (response.success) {
            proseStore.setEntries(
                proseStore.entries.map((existing) =>
                    existing.id === entry.id ? response.data : existing
                )
            );
        }
        return response.data;
    };

    const deleteProseEntry = async (entryId: string) => {
        const response = await proseService.delete(entryId);
        if (response.success) {
            proseStore.setEntries(
                proseStore.entries.filter((entry) => entry.id !== entryId)
            );
        }
        return response.data;
    };

    const updateProseItemReaction = async (
        proseEntry: ProseEntry,
        target: ProseEntry | Comment,
        reactionKey: EmojiReactionKey,
        commentId?: string
    ) => {
        const loggedInUsername = useUserStore().loggedInUser.username;

        if (commentId) {
            const updatedComments = (proseEntry.comments || []).map(
                (comment) =>
                    comment.id === commentId
                        ? toggleEmojiReaction(
                              comment,
                              reactionKey,
                              loggedInUsername
                          )
                        : comment
            );
            return updateProseEntry(
                {
                    ...proseEntry,
                    comments: updatedComments,
                },
                buildReactionMetadata(
                    proseEntry,
                    target,
                    "prose_reaction",
                    reactionKey
                )
            );
        }

        const updatedEntry = toggleEmojiReaction(
            proseEntry,
            reactionKey,
            loggedInUsername
        );

        return updateProseEntry(
            updatedEntry,
            buildReactionMetadata(
                proseEntry,
                target,
                "prose_reaction",
                reactionKey
            )
        );
    };

    const updateProseEntryFavorites = async (
        proseEntry: ProseEntry,
        action: "add" | "remove"
    ) => {
        const loggedInUsername = useUserStore().loggedInUser.username;
        const updatedEntry = {
            ...proseEntry,
            favorites:
                action === "add"
                    ? [...(proseEntry.favorites || []), loggedInUsername]
                    : (proseEntry.favorites || []).filter(
                          (username) => username !== loggedInUsername
                      ),
        };
        return updateProseEntry(updatedEntry);
    };

    const addComment = async (proseEntry: ProseEntry, comment: Comment) => {
        const updatedEntry = {
            ...proseEntry,
            comments: [...(proseEntry.comments || []), comment],
        };
        const metadata = comment.replyToId
            ? buildReplyMetadata(proseEntry, comment)
            : buildReactionMetadata(proseEntry, comment, "prose_comment");

        return updateProseEntry(updatedEntry, metadata);
    };

    const toggleProseEntryReaction = async (
        entry: ProseEntry,
        reactionKey: EmojiReactionKey
    ) => {
        return updateProseItemReaction(entry, entry, reactionKey);
    };

    const toggleProseCommentReaction = async (
        entry: ProseEntry,
        comment: Comment,
        reactionKey: EmojiReactionKey
    ) => {
        return updateProseItemReaction(entry, comment, reactionKey, comment.id);
    };

    const likeProseEntry = async (entry: ProseEntry) => {
        return toggleProseEntryReaction(entry, "thumbs_up");
    };

    const dislikeProseEntry = async (entry: ProseEntry) => {
        return toggleProseEntryReaction(entry, "thumbs_down");
    };

    const favoriteProseEntry = async (entry: ProseEntry) => {
        return updateProseEntryFavorites(entry, "add");
    };

    const unfavoriteProseEntry = async (entry: ProseEntry) => {
        return updateProseEntryFavorites(entry, "remove");
    };

    const likeComment = async (entry: ProseEntry, comment: Comment) => {
        return toggleProseCommentReaction(entry, comment, "thumbs_up");
    };

    const dislikeComment = async (entry: ProseEntry, comment: Comment) => {
        return toggleProseCommentReaction(entry, comment, "thumbs_down");
    };

    return {
        getProseEntries,
        getProseEntry,
        createProseEntry,
        updateProseEntry,
        deleteProseEntry,
        addComment,
        toggleProseEntryReaction,
        toggleProseCommentReaction,
        likeProseEntry,
        dislikeProseEntry,
        favoriteProseEntry,
        unfavoriteProseEntry,
        likeComment,
        dislikeComment,
    };
};
