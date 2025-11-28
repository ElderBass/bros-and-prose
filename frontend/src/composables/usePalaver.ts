import { ref, onValue, off, type DataSnapshot } from "firebase/database";
import { getFirebase } from "@/setup/firebaseClient";
import { palaverService } from "@/services";
import { usePalaverStore } from "@/stores/palaver";
import type { Comment, PalaverEntry, PalaverEntryMetadata } from "@/types";
import {
    buildPalaverEntryMetadata,
    buildPalaverReactionMetadata,
    checkForUnreadEntries,
    sortPalaverStuff,
} from "@/utils";
import { useUserStore } from "@/stores/user";
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

    const updatePalaverEntry = async (
        entry: PalaverEntry,
        metadata: PalaverEntryMetadata
    ) => {
        const updateType = metadata.updateType ?? entry.type;
        const response = await palaverService.update({
            entry,
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

    const updatePalaverEntryLikesDislikes = async (
        entry: PalaverEntry,
        action: "like" | "dislike"
    ) => {
        const loggedInUsername = useUserStore().loggedInUser?.username;

        if (action === "like") {
            if (entry.likes?.includes(loggedInUsername)) {
                return;
            }
            entry.likes = [...(entry.likes || []), loggedInUsername];
            entry.dislikes = entry.dislikes?.filter(
                (d) => d !== loggedInUsername
            );
        } else {
            if (entry.dislikes?.includes(loggedInUsername)) {
                return;
            }
            entry.dislikes = [...(entry.dislikes || []), loggedInUsername];
            entry.likes = entry.likes?.filter((l) => l !== loggedInUsername);
        }
        const metadata = buildPalaverReactionMetadata(entry, action);
        return await updatePalaverEntry(entry, metadata);
    };

    const likePalaverEntry = async (entry: PalaverEntry) => {
        const updateEntry = await updatePalaverEntryLikesDislikes(
            entry,
            "like"
        );
        return updateEntry;
    };

    const dislikePalaverEntry = async (entry: PalaverEntry) => {
        const updateEntry = await updatePalaverEntryLikesDislikes(
            entry,
            "dislike"
        );
        return updateEntry;
    };

    const addComment = async (entry: PalaverEntry, comment: Comment) => {
        const metadata = buildPalaverReactionMetadata(entry, "comment");

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

    return {
        getPalaverEntries,
        createPalaverEntry,
        updatePalaverEntry,
        deletePalaverEntry,
        likePalaverEntry,
        dislikePalaverEntry,
        addComment,
    };
};
