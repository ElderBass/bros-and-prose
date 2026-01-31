import { useUserStore } from "@/stores/user";
import { sortBooks } from "./bookUtils";
import type { FavoriteType, BookshelfBook } from "@/types";

export const getUpdatedFavorites = (
    selectedFavoriteType: FavoriteType,
    items: string[] | BookshelfBook[]
) => {
    const user = useUserStore().loggedInUser;

    let processedItems: string[] | BookshelfBook[];

    if (selectedFavoriteType === "books") {
        // For books, items should be BookshelfBook[]
        processedItems = items as BookshelfBook[];
    } else {
        // For authors/genres, items should be string[]
        processedItems = Array.from(new Set(items as string[]));
    }

    const updatedFavorites = {
        ...user.favorites,
        [selectedFavoriteType]: [
            ...(user.favorites?.[selectedFavoriteType] || []),
            ...processedItems,
        ],
    };
    return updatedFavorites;
};

export const getNonBookItemColumns = (items: string[]) => {
    const itemsPerColumn = 3;
    const columns: string[][] = [];

    for (let i = 0; i < items.length; i += itemsPerColumn) {
        columns.push(items.slice(i, i + itemsPerColumn));
    }

    return columns;
};

export const getBookItems = (items: string[]) => {
    return items.map((item) => JSON.parse(item) as BookshelfBook);
};

export const getBookItemColumns = (
    items: string[],
    sortOrder: "asc" | "desc" = "asc"
) => {
    const itemsPerColumn = 2; // 2 books per column
    const books = sortBooks(getBookItems(items), sortOrder);
    const columns: BookshelfBook[][] = [];

    for (let i = 0; i < books.length; i += itemsPerColumn) {
        columns.push(books.slice(i, i + itemsPerColumn));
    }

    return columns;
};

export const getUserFavorites = () => {
    const user = useUserStore().loggedInUser;
    return user.favorites;
};

export const getUserFavorite = (favoriteType: FavoriteType) => {
    const targetFavs = getUserFavorites()?.[favoriteType];
    return targetFavs ? Object.values(targetFavs) : [];
};

const sortNonBookFavorites = (favorites: string[]) => {
    return favorites.sort((a, b) => a.localeCompare(b));
};

export const getFavoriteAuthors = () =>
    sortNonBookFavorites(getUserFavorite("authors"));
export const getFavoriteGenres = () =>
    sortNonBookFavorites(getUserFavorite("genres"));

export const getFavoriteBooks = () => {
    const books = getUserFavorite("books");

    return sortBooks(getBookItems(books));
};

export const getFavoriteBookById = (bookId: string) => {
    return getFavoriteBooks().find((book) => book.id === bookId);
};

export const isBookFavorite = (bookId: string) => {
    return getFavoriteBookById(bookId) !== undefined;
};
