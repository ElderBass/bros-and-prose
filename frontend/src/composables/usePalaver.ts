import { palaverService } from "@/services";
import { usePalaverStore } from "@/stores/palaver";
import type { Book, PalaverEntry } from "@/types";
import { useBooks } from "./useBooks";
import { currentBookId } from "@/services/books";
import { getUserInfo } from "@/utils";
import { useUserStore } from "@/stores/user";
import { useLog } from "./useLog";

export const usePalaver = () => {
    const palaverStore = usePalaverStore();
    const { loggedInUser } = useUserStore();

    const getPalaverEntries = async () => {
        const response = await palaverService.list();
        console.log(
            "\n KERTWANGING GET PALAVER ENTRIES response in getPalaverEntries",
            response,
            "\n\n"
        );
        if (response.success) {
            console.log(
                "\n KERTWANGING GET PALAVER ENTRIES response.data in getPalaverEntries",
                response.data,
                "\n\n"
            );
            palaverStore.setEntries(response.data);
        }
        return response.data;
    };

    const createPalaverEntry = async (entry: PalaverEntry) => {
        await useLog().info(`Creating palaver entry: ${JSON.stringify(entry)}`);
        const response = await palaverService.create(entry);
        if (response.success) {
            palaverStore.prepend(response.data);
            if (entry.type === "discussion_note") {
                let book: Book;
                if (entry.bookId === currentBookId) {
                    book = await useBooks().getCurrentBook();
                } else {
                    book = await useBooks().getPastBook(entry.bookId as string);
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
