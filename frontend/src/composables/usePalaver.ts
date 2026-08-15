import { ref, onValue, off, type DataSnapshot } from "firebase/database";
import { getFirebase } from "@/setup/firebaseClient";
import { palaverService } from "@/services";
import { usePalaverStore } from "@/stores/palaver";
import { useUserStore } from "@/stores/user";
import type {
    Comment,
    EmojiReactionKey,
    PalaverEntry,
    PalaverEntryMetadata,
    Review,
} from "@/types";
import {
    buildPalaverEntryFromReview,
    buildPalaverEntryMetadata,
    buildPalaverReactionMetadata,
    buildReplyMetadata,
    checkForUnreadEntries,
    sortPalaverStuff,
    toggleEmojiReaction,
} from "@/utils";
import { useLog } from "./useLog";

let unsubscribe: (() => void) | null = null;

export function subscribeToPalaver() {
    if (unsubscribe) return; // already listening
    const { db } = getFirebase();
    const palaverRef = ref(db, "palaver");

    const handler = (snapshot: DataSnapshot) => {
        const value = snapshot.val() ?? {};
        const list = Object.values(value).filter(
            (item: unknown) => (item as PalaverEntry).id
        );
        const sortedEntries = sortPalaverStuff(
            list as PalaverEntry[]
        ) as PalaverEntry[];
        usePalaverStore().setEntries(sortedEntries);
        checkForUnreadEntries(sortedEntries);
    };

    onValue(palaverRef, handler, (error) => {
        console.error("KERTWANGING error in subscribeToPalaver", error);
    });
    unsubscribe = () => off(palaverRef, "value", handler);
}

export function unsubscribeFromPalaver() {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
}

export const usePalaver = () => {
    const palaverStore = usePalaverStore();

    const getPalaverEntries = async (isInit = false) => {
        const response = await palaverService.list();
        if (response.success) {
            const sortedEntries = sortPalaverStuff(
                response.data
            ) as PalaverEntry[];
            palaverStore.setEntries(sortedEntries);
            if (isInit) {
                subscribeToPalaver();
                checkForUnreadEntries(sortedEntries);
            }
            return sortedEntries;
        }
        return [];
    };

    const createPalaverEntry = async (entry: PalaverEntry) => {
        await useLog().info(`Creating palaver entry: ${JSON.stringify(entry)}`);
        const metadata = buildPalaverEntryMetadata(entry);
        const response = await palaverService.create({ entry, metadata });
        if (response.success) {
            useLog().info(`Palaver entry created: ${JSON.stringify(entry)}`);
        }
        return response.data;
    };

    const createPalaverEntryFromReview = async (review: Review) => {
        const entry = buildPalaverEntryFromReview(review);
        const response = await createPalaverEntry(entry);
        return response;
    };

    const updatePalaverEntry = async (
        entry: PalaverEntry,
        metadata: PalaverEntryMetadata
    ) => {
        const updateType = metadata.updateType ?? entry.type;
        const response = await palaverService.update({
            entry: {
                ...entry,
                updatedAt: new Date().toISOString(),
            },
            metadata: { ...metadata, updateType },
        });
        if (response.success) {
            palaverStore.setEntries(
                palaverStore.entries.map((e) =>
                    e.id === entry.id ? response.data : e
                )
            );
        }
        return response.data;
    };

    const deletePalaverEntry = async (entryId: string) => {
        const response = await palaverService.delete(entryId);
        if (response.success) {
            palaverStore.setEntries(
                palaverStore.entries.filter((e) => e.id !== entryId)
            );
        }
        return response.data;
    };

    const updatePalaverItemReaction = async (
        item: PalaverEntry | Comment,
        reactionKey: EmojiReactionKey,
        entryId?: string
    ) => {
        let updatedItem;
        let metadataTarget: PalaverEntry | Comment;
        const loggedInUsername = useUserStore().loggedInUser.username;

        if (entryId) {
            const updatedComment = toggleEmojiReaction(
                item,
                reactionKey,
                loggedInUsername
            ) as Comment;
            const entry = palaverStore.entries.find(
                (e) => e.id === entryId
            ) as PalaverEntry;
            updatedItem = {
                ...entry,
                comments: entry.comments?.map((c) =>
                    c.id === item.id ? updatedComment : c
                ),
            };
            metadataTarget = updatedComment;
        } else {
            updatedItem = toggleEmojiReaction(
                item,
                reactionKey,
                loggedInUsername
            ) as PalaverEntry;
            metadataTarget = updatedItem;
        }

        const metadata = buildPalaverReactionMetadata(
            metadataTarget,
            "reaction",
            reactionKey
        );
        return await updatePalaverEntry(updatedItem, metadata);
    };

    const togglePalaverEntryReaction = async (
        entry: PalaverEntry,
        reactionKey: EmojiReactionKey
    ) => {
        return await updatePalaverItemReaction(entry, reactionKey);
    };

    const togglePalaverCommentReaction = async (
        comment: Comment,
        entryId: string,
        reactionKey: EmojiReactionKey
    ) => {
        return await updatePalaverItemReaction(comment, reactionKey, entryId);
    };

    const likePalaverEntry = async (entry: PalaverEntry) => {
        return await togglePalaverEntryReaction(entry, "thumbs_up");
    };

    const dislikePalaverEntry = async (entry: PalaverEntry) => {
        return await togglePalaverEntryReaction(entry, "thumbs_down");
    };

    const addComment = async (entry: PalaverEntry, comment: Comment) => {
        // Check if this is a reply and build appropriate metadata
        const metadata = comment.replyToId
            ? buildReplyMetadata(comment, entry)
            : buildPalaverReactionMetadata(entry, "comment");

        const response = await palaverService.update({
            entry: { ...entry, comments: [...(entry.comments || []), comment] },
            metadata,
        });
        if (response.success) {
            palaverStore.setEntries(
                palaverStore.entries.map((e) =>
                    e.id === entry.id ? response.data : e
                )
            );
        }
        return response.data;
    };

    const likeComment = async (comment: Comment, entryId: string) => {
        return await togglePalaverCommentReaction(
            comment,
            entryId,
            "thumbs_up"
        );
    };

    const dislikeComment = async (comment: Comment, entryId: string) => {
        return await togglePalaverCommentReaction(
            comment,
            entryId,
            "thumbs_down"
        );
    };

    return {
        getPalaverEntries,
        createPalaverEntry,
        createPalaverEntryFromReview,
        updatePalaverEntry,
        deletePalaverEntry,
        togglePalaverEntryReaction,
        togglePalaverCommentReaction,
        likePalaverEntry,
        dislikePalaverEntry,
        addComment,
        likeComment,
        dislikeComment,
    };
};
