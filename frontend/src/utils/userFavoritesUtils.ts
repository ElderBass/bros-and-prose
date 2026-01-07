import { useUserStore } from "@/stores/user";
import type { FavoriteType, BookshelfBook } from "@/types";

export const getUpdatedFavorites = (
    selectedFavoriteType: FavoriteType,
    items: string[]
) => {
    const user = useUserStore().loggedInUser;
    const updatedFavorites = {
        ...user.favorites,
        [selectedFavoriteType]: Array.from(new Set(items)),
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

export const getBookItemColumns = (items: string[]) => {
    const itemsPerColumn = 2; // 2 books per column
    const books = getBookItems(items);
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

export const getFavoriteAuthors = () => getUserFavorite("authors");
export const getFavoriteGenres = () => getUserFavorite("genres");
export const getFavoriteBooks = () => getUserFavorite("books");

export const getFavoriteBookById = (bookId: string) => {
    return getFavoriteBooks().find((book) => book.id === bookId);
};

export const isBookFavorite = (bookId: string) => {
    return getFavoriteBookById(bookId) !== undefined;
};
