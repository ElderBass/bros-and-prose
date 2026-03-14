import { ref, onValue, off, type DataSnapshot } from "firebase/database";
import { getFirebase } from "@/setup/firebaseClient";
import { proseService } from "@/services";
import { useProseStore } from "@/stores/prose";
import { useUserStore } from "@/stores/user";
import type { Comment, ProseEntry, ProseEntryMetadata } from "@/types";
import { getMentionedUsers } from "@/utils";
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

const getUniqueUsernames = (users: string[] = []) => {
    return Array.from(new Set(users));
};

const getMentionMetadata = (text: string) => {
    const currentUserId = useUserStore().loggedInUser?.id;
    const allUsers = useUserStore().allUsers;
    const mentionedUsers = getMentionedUsers(text, allUsers)
        .filter((user) => user.id !== currentUserId)
        .map((user) => ({ username: user.username, email: user.email }));

    return mentionedUsers.length > 0 ? mentionedUsers : undefined;
};

const buildCreateMetadata = (entry: ProseEntry): ProseEntryMetadata => ({
    username: entry.userInfo.username,
    proseTitle: entry.title,
    text: entry.markdown,
    updateType: "prose_created",
    mentionedUsers: getMentionMetadata(entry.markdown),
});

const buildReactionMetadata = (
    proseEntry: ProseEntry,
    target: ProseEntry | Comment,
    updateType: "prose_like" | "prose_dislike" | "prose_comment"
): ProseEntryMetadata => {
    const commentText =
        updateType === "prose_comment" && "text" in target
            ? target.text
            : undefined;

    return {
        username: useUserStore().loggedInUser.username,
        proseTitle: proseEntry.title,
        targetUsername: target.userInfo.username,
        targetUserEmail: target.userInfo.email,
        updateType,
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
        useProseStore().setEntries(sortProseEntries(list));
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
            if (isInit) {
                subscribeToProse();
            }
            return sortedEntries;
        }
        return [];
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

    const updateProseItemLikesDislikes = async (
        proseEntry: ProseEntry,
        target: ProseEntry | Comment,
        action: "like" | "dislike",
        commentId?: string
    ) => {
        const loggedInUsername = useUserStore().loggedInUser.username;

        if (commentId) {
            const updatedComments = (proseEntry.comments || []).map(
                (comment) => {
                    if (comment.id !== commentId) return comment;
                    if (action === "like") {
                        return {
                            ...comment,
                            likes: getUniqueUsernames([
                                ...(comment.likes || []),
                                loggedInUsername,
                            ]),
                            dislikes: (comment.dislikes || []).filter(
                                (username) => username !== loggedInUsername
                            ),
                        };
                    }
                    return {
                        ...comment,
                        dislikes: getUniqueUsernames([
                            ...(comment.dislikes || []),
                            loggedInUsername,
                        ]),
                        likes: (comment.likes || []).filter(
                            (username) => username !== loggedInUsername
                        ),
                    };
                }
            );
            return updateProseEntry(
                {
                    ...proseEntry,
                    comments: updatedComments,
                },
                buildReactionMetadata(
                    proseEntry,
                    target,
                    action === "like" ? "prose_like" : "prose_dislike"
                )
            );
        }

        const updatedEntry =
            action === "like"
                ? {
                      ...proseEntry,
                      likes: getUniqueUsernames([
                          ...(proseEntry.likes || []),
                          loggedInUsername,
                      ]),
                      dislikes: (proseEntry.dislikes || []).filter(
                          (username) => username !== loggedInUsername
                      ),
                  }
                : {
                      ...proseEntry,
                      dislikes: getUniqueUsernames([
                          ...(proseEntry.dislikes || []),
                          loggedInUsername,
                      ]),
                      likes: (proseEntry.likes || []).filter(
                          (username) => username !== loggedInUsername
                      ),
                  };

        return updateProseEntry(
            updatedEntry,
            buildReactionMetadata(
                proseEntry,
                target,
                action === "like" ? "prose_like" : "prose_dislike"
            )
        );
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

    const likeProseEntry = async (entry: ProseEntry) => {
        return updateProseItemLikesDislikes(entry, entry, "like");
    };

    const dislikeProseEntry = async (entry: ProseEntry) => {
        return updateProseItemLikesDislikes(entry, entry, "dislike");
    };

    const likeComment = async (entry: ProseEntry, comment: Comment) => {
        return updateProseItemLikesDislikes(entry, comment, "like", comment.id);
    };

    const dislikeComment = async (entry: ProseEntry, comment: Comment) => {
        return updateProseItemLikesDislikes(
            entry,
            comment,
            "dislike",
            comment.id
        );
    };

    return {
        getProseEntries,
        createProseEntry,
        updateProseEntry,
        deleteProseEntry,
        addComment,
        likeProseEntry,
        dislikeProseEntry,
        likeComment,
        dislikeComment,
    };
};
