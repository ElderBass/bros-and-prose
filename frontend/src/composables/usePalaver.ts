import { ref, onValue, off, type DataSnapshot } from "firebase/database";
import { getFirebase } from "@/setup/firebaseClient";
import { palaverService } from "@/services";
import { usePalaverStore } from "@/stores/palaver";
import type { Book, PalaverEntry } from "@/types";
import { useBooks } from "./useBooks";
import { currentBookId } from "@/services/books";
import { checkForUnreadEntries, getUserInfo } from "@/utils";
import { useUserStore } from "@/stores/user";
import { useLog } from "./useLog";

let unsubscribe: (() => void) | null = null;

const sortEntries = (entries: PalaverEntry[]) => {
    return [...entries].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export function subscribeToPalaver() {
    if (unsubscribe) return; // already listening
    const { db } = getFirebase();
    const palaverRef = ref(db, "palaver");

    const handler = (snapshot: DataSnapshot) => {
        const value = snapshot.val() ?? {};
        const list = Object.values(value).filter(
            (item: unknown) => (item as PalaverEntry).id
        );
        const sortedEntries = sortEntries(list as PalaverEntry[]);
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
    const { loggedInUser } = useUserStore();

    const getPalaverEntries = async (isInit = false) => {
        const response = await palaverService.list();
        if (response.success) {
            const sortedEntries = sortEntries(response.data);
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
        const response = await palaverService.create(entry);
        if (response.success) {
            palaverStore.prepend(response.data);
            if (entry.type === "discussion_note") {
                let book: Book;
                if (entry.bookInfo?.id === currentBookId) {
                    book = await useBooks().getCurrentBook();
                } else {
                    book = await useBooks().getPastBook(
                        entry.bookInfo?.id as string
                    );
                }
                if (book) {
                    await useLog().info(
                        `Adding discussion comment to book: ${book.title}`
                    );
                    await useBooks().addDiscussionComment(book, {
                        id: entry.id,
                        createdAt: entry.createdAt,
                        comment: entry.text,
                        user: getUserInfo(loggedInUser),
                    });
                }
            }
        }
        return response.data;
    };

    const updatePalaverEntry = async (entry: PalaverEntry) => {
        const response = await palaverService.update(entry);
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

    return {
        getPalaverEntries,
        createPalaverEntry,
        updatePalaverEntry,
        deletePalaverEntry,
    };
};
