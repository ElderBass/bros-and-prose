import type { OpenLibraryBookResult, FutureBook, User } from "@/types";
import { capitalizeBookTitle } from "./capitalizeBookTitle";
import { v4 as uuid } from "uuid";
import { faBookMedical, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import type { ModalType } from "@/stores/shelfModal";

export const buildBookShelfEntry = (
    bookData: OpenLibraryBookResult,
    comment: string,
    tags: string[]
): FutureBook => {
    const { title, author_name, first_publish_year, cover_i } = bookData;
    return {
        id: uuid(),
        title: capitalizeBookTitle(title.trim()),
        author: author_name[0].trim(),
        description: comment.trim(),
        yearPublished: parseInt(first_publish_year?.toString()) || 1969,
        imageSrc: cover_i
            ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
            : "",
        tags,
        votes: [],
    };
};

export const getShelfDisplayName = (shelf: "wantToRead" | "haveRead") => {
    return shelf === "wantToRead" ? "want to read" : "have read";
};

export const getShelfMessage = (shelf: "wantToRead" | "haveRead") => {
    return shelf === "wantToRead"
        ? "fucking NEED this book, dawg"
        : "been there, read that";
};

export const getShelfSuccessMessage = (shelf: "wantToRead" | "haveRead") => {
    return shelf === "wantToRead"
        ? "that book's gunna get got."
        : "look at you, all reading and shit.";
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

export const getShelfIcon = (shelf: "wantToRead" | "haveRead") => {
    return shelf === "wantToRead" ? faBookMedical : faBookOpen;
};

export const getUserShelves = (user: User) => {
    return {
        wantToRead: Object.values(user.wantToRead || []),
        haveRead: Object.values(user.haveRead || []),
    };
};
