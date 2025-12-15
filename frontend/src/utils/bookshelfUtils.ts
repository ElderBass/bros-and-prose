import type {
    OpenLibraryBookResult,
    User,
    Shelf,
    BookshelfBook,
} from "@/types";
import { capitalizeBookTitle } from "./capitalizeBookTitle";
import { v4 as uuid } from "uuid";
import {
    faBookMedical,
    faBookOpen,
    faBookOpenReader,
} from "@fortawesome/free-solid-svg-icons";
import type { ModalType } from "@/stores/shelfModal";

export const buildBookShelfEntry = (
    bookData: OpenLibraryBookResult,
    comment: string,
    tags: string[]
): BookshelfBook => {
    const { title, subtitle, author_name, first_publish_year, cover_i } =
        bookData;
    let fullTitle = title.trim();
    if (subtitle) {
        fullTitle += `: ${subtitle.trim()}`;
    }
    return {
        id: uuid(),
        title: capitalizeBookTitle(fullTitle),
        author: author_name[0].trim(),
        description: comment.trim(),
        yearPublished: parseInt(first_publish_year?.toString()) || 1969,
        imageSrc: cover_i
            ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
            : "",
        tags,
    };
};

export const getShelfDisplayName = (shelf: Shelf) => {
    switch (shelf) {
        case "currentlyReading":
            return "currently reading";
        case "wantToRead":
            return "want to read";
        case "haveRead":
            return "have read";
    }
};

export const getShelfMessage = (shelf: Shelf) => {
    switch (shelf) {
        case "currentlyReading":
            return "esketit, literature-wise";
        case "wantToRead":
            return "fucking NEED this book, dawg";
        case "haveRead":
            return "been there, read that";
    }
};

export const getShelfSuccessMessage = (shelf: Shelf) => {
    switch (shelf) {
        case "currentlyReading":
            return "just don't neglect the required prose, my dude";
        case "wantToRead":
            return "that book's gunna get got.";
        case "haveRead":
            return "look at you, all reading and shit.";
    }
};

export const getErrorActionText = (modalType: ModalType) => {
    switch (modalType) {
        case "addBook":
            return "adding";
        case "editBook":
            return "editing";
        case "removeBook":
            return "removing";
        case "moveBook":
            return "moving";
        default:
            return "doing";
    }
};

export const getShelfIcon = (shelf: Shelf) => {
    switch (shelf) {
        case "currentlyReading":
            return faBookOpenReader;
        case "wantToRead":
            return faBookMedical;
        case "haveRead":
            return faBookOpen;
    }
};

export const getUserShelves = (user: User) => {
    return {
        currentlyReading: user.currentlyReading || null,
        wantToRead:
            Object.values(user.wantToRead || {}).filter((b) => b?.id) || [],
        haveRead: Object.values(user.haveRead || {}).filter((b) => b?.id) || [],
    };
};
