import { ref, onValue, off, type DataSnapshot } from "firebase/database";
import { getFirebase } from "@/setup/firebaseClient";
import { futureBooksService } from "@/services/futureBooks";
import { useFutureBooksStore } from "@/stores/futureBooks";
import type { ArchivedBooksEntry, FutureBook } from "@/types/books";
import { useLog } from "./useLog";
import {
    buildArchiveEntry,
    getMostVotedFutureBookId,
    getUsersFutureBookVoteId,
    sanitizeFutureBookVotes,
} from "@/utils";
import { usersService } from "@/services/users";
import { ON_DECK_BOOK_SELECTOR } from "@/constants";

let unsubscribe: (() => void) | null = null;

export const subscribeToFutureBooks = () => {
    if (unsubscribe) return; // already listening
    const { db } = getFirebase();
    const currentSelectionsRef = ref(db, "books/futureBooks/current");

    const handler = (snapshot: DataSnapshot) => {
        const value = snapshot.val() ?? {};
        const list = Object.values(value).filter(
            (selection: unknown) => (selection as FutureBook).id
        );
        useFutureBooksStore().setCurrentSelections(list as FutureBook[]);
    };

    onValue(currentSelectionsRef, handler, (error) => {
        console.error("KERTWANGING error in subscribeToFutureBooks", error);
    });
    unsubscribe = () => off(currentSelectionsRef, "value", handler);
};

export const unsubscribeFromFutureBooks = () => {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
};

export const useFutureBooks = () => {
    const futureBooksStore = useFutureBooksStore();
    const { info } = useLog();

    const getCurrentSelections = async (isInit = false) => {
        const selections = await futureBooksService.getCurrentSelections();
        const hasSelections = selections[0]?.id;
        if (hasSelections) {
            futureBooksStore.setCurrentSelections(selections);
        } else {
            futureBooksStore.clearCurrentSelections();
        }
        if (isInit) {
            subscribeToFutureBooks();
            if (hasSelections) {
                const mostVotedFutureBookId =
                    getMostVotedFutureBookId(selections);
                futureBooksStore.setMostVotedFutureBookId(
                    mostVotedFutureBookId
                );
            } else {
                futureBooksStore.setMostVotedFutureBookId("");
            }
        }
        return selections;
    };

    const addCurrentSelection = async (selection: FutureBook) => {
        const updatedSelections =
            await futureBooksService.addCurrentSelection(selection);
        futureBooksStore.setCurrentSelections(updatedSelections);
        return updatedSelections;
    };

    const updateCurrentSelection = async (selection: FutureBook) => {
        const updatedSelection =
            await futureBooksService.updateCurrentSelection(selection);
        await info(`Updated future book selection: ${selection.title}`);

        const updatedSelections = futureBooksStore.currentSelections.map((b) =>
            b.id === selection.id ? updatedSelection : b
        );
        futureBooksStore.setCurrentSelections(updatedSelections);

        const mostVotedFutureBookId =
            getMostVotedFutureBookId(updatedSelections);
        futureBooksStore.setMostVotedFutureBookId(mostVotedFutureBookId);
        return updatedSelection;
    };

    const deleteCurrentSelection = async (selectionId: string) => {
        const updatedSelections =
            await futureBooksService.deleteCurrentSelection(selectionId);
        await info(`Deleted future book selection: ${selectionId}`);
        futureBooksStore.setCurrentSelections(updatedSelections);
        return updatedSelections;
    };

    const voteForFutureBook = async (bookId: string, userId: string) => {
        const book = futureBooksStore.currentSelections.find(
            (b) => b.id === bookId
        );
        const voteId = getUsersFutureBookVoteId(userId);
        if (!book) {
            await useLog().error(`Future book not found: ${bookId}`);
            return;
        }
        const hasVotedForCurrentBook = voteId === bookId;
        if (!hasVotedForCurrentBook) {
            await removeVoteForFutureBook(voteId, userId);
        }
        const updatedVotes = hasVotedForCurrentBook
            ? book.votes.filter((v) => v !== userId)
            : [...book.votes, userId];
        const updatedSelection = await updateCurrentSelection({
            ...book,
            votes: updatedVotes,
        });
        return updatedSelection;
    };

    const removeVoteForFutureBook = async (bookId: string, userId: string) => {
        const book = futureBooksStore.currentSelections.find(
            (b) => b.id === bookId
        );
        if (!book) {
            await useLog().error(`Future book not found: ${bookId}`);
            return;
        }
        const votes = book.votes.filter((v) => v !== userId);
        await updateCurrentSelection({ ...book, votes });
    };

    const getArchivedSelections = async () => {
        const selections = await futureBooksService.getArchivedSelections();
        const sanitizedSelections = selections.map((selection) => ({
            ...selection,
            archivedBooks: sanitizeFutureBookVotes(selection.archivedBooks),
        }));
        futureBooksStore.setArchivedSelections(sanitizedSelections);
        return selections;
    };

    const archiveSelections = async () => {
        const currentSelections = futureBooksStore.currentSelections;
        const currentSelectorId = futureBooksStore.currentSelector.id;
        const archiveEntry: ArchivedBooksEntry = buildArchiveEntry(
            currentSelections,
            currentSelectorId
        );
        const updatedSelections =
            await futureBooksService.archiveSelections(archiveEntry);
        futureBooksStore.setArchivedSelections(updatedSelections);
        futureBooksStore.clearCurrentSelections();
        await info(
            `Archived future book selections: ${archiveEntry.archivedBooks.length}`
        );
        await setCurrentSelector(ON_DECK_BOOK_SELECTOR);
        return updatedSelections;
    };

    const setCurrentSelector = async (selectorId: string) => {
        await futureBooksService.setCurrentSelector(selectorId);
        const selector = await usersService.getUser(selectorId);
        futureBooksStore.setCurrentSelector(selector);
        return selector;
    };

    const getCurrentSelector = async () => {
        const selectorId = await futureBooksService.getCurrentSelector();
        const selector = await usersService.getUser(selectorId);
        futureBooksStore.setCurrentSelector(selector);
        return selector;
    };

    return {
        getCurrentSelections,
        addCurrentSelection,
        updateCurrentSelection,
        deleteCurrentSelection,
        voteForFutureBook,
        removeVoteForFutureBook,
        getArchivedSelections,
        archiveSelections,
        setCurrentSelector,
        getCurrentSelector,
    };
};
