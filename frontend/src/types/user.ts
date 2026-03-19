import type {
    IconPathData,
    IconPrefix,
    IconName,
} from "@fortawesome/fontawesome-svg-core";
import type { Review } from "./review";
import type { BookshelfBook } from "./books";
import type { ProseEntry } from "./prose";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    currentBookProgress: number;
    bookProgress?: { [bookId: string]: number };
    avatar: string;
    avatarType?: "icon" | "image"; // Type of avatar: icon (FontAwesome) or image (uploaded file)
    reviews: {
        [key: string]: Review;
    };
    role: "admin" | "user";
    currentlyReading?: BookshelfBook[];
    wantToRead?: BookshelfBook[];
    haveRead?: BookshelfBook[];
    favorites?: UserFavorites;
    yearReadingGoal?: number;
}

export interface UserFavorites {
    authors?: string[];
    genres?: string[];
    books?: BookshelfBook[];
    prose?: ProseEntry[];
}

export type FavoriteType = "authors" | "genres" | "books" | "prose";

export interface UserInfo {
    id: string;
    username: string;
    email: string;
    avatar: string;
    avatarType?: "icon" | "image";
}

export interface UserResponse {
    success: boolean;
    message: string;
    user: User;
}

export type AvatarProp = {
    icon: [number, number, string[], string, IconPathData];
    prefix: IconPrefix;
    iconName: IconName;
};

export type ShelfAddMetadata = {
    updateType: string;
    bookTitle: string;
    bookAuthor: string;
    bookDescription: string;
    username: string;
};

export type ProgressUpdateMetadata = {
    updateType: string;
    username: string;
    bookTitle: string;
    bookAuthor: string;
    currentPage: string;
    totalPages: string;
    percentage: string;
};
