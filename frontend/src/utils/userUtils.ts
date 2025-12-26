import { FINISHED_BOOK_PROGRESS } from "@/constants";
import { useBooksStore } from "@/stores/books";
import { useUserStore } from "@/stores/user";
import type { User } from "@/types";

export const hasFinishedCurrentBook = (bro?: User) => {
    let user = bro;
    const currentBookTotalPages = useBooksStore().currentBook.totalPages;

    if (!bro) {
        user = useUserStore().loggedInUser;
    }
    return (
        user?.currentBookProgress === FINISHED_BOOK_PROGRESS ||
        user?.currentBookProgress === currentBookTotalPages
    );
};
