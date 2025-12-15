import type { Book, FutureBook, User } from "@/types";

export const FINISHED_BOOK_PROGRESS = 69420;

export const DEFAULT_RATING = 5;
export const DEFAULT_REVIEW = {
    rating: DEFAULT_RATING,
    reviewComment: "",
};
export const EMPTY_BOOK_INFO = {
    title: "",
    author: "",
    id: "",
};

export const RATING_MAP = {
    0: "nunya",
    1: "burn it",
    2: "trash",
    3: "yikes",
    4: "oof",
    5: "meh",
    6: "solid",
    7: "rock solid",
    8: "superb",
    9: "truly exceptional",
    10: "would read again",
};

export const FINISHED = "finished";
export const FINISHED_MOBILE = "fin";
export const BRO_NOT_STARTED = "lazy fuck hasn't started";
export const BRO_NOT_STARTED_MOBILE = "fuckin zero";

export const EMPTY_REVIEW = {
    id: "",
    rating: 0,
    book: {} as Book,
    reviewComment: "",
};

export const EMPTY_COMMENT = {
    id: "",
    user: {} as User,
    comment: "",
    createdAt: "",
};

export const ON_DECK_BOOK_SELECTOR = "chris_dub";

export const ARCHIVE_ENABLED = false;

export const COMMON_BOOK_TAGS = [
    "adventure",
    "anthology",
    "biography",
    "bleak",
    "cerebral",
    "classic",
    "coming-of-age",
    "dark comedy",
    "dystopian",
    "experimental",
    "fantasy",
    "graphic novel",
    "historical",
    "horror",
    "humor",
    "literary",
    "memoir",
    "metafiction",
    "multiple POVs",
    "mystery",
    "noir",
    "nonfiction",
    "philosophy",
    "picaresque",
    "poetry",
    "political",
    "pop-culture",
    "psychology",
    "romance",
    "satire",
    "sentimental",
    "sci-fi",
    "science",
    "self-help",
    "series",
    "social justice",
    "tech",
    "thriller",
    "tragedy",
    "true crime",
    "YA",
];

export const EMPTY_CURRENT_BOOK: FutureBook = {
    id: "",
    title: "",
    author: "",
    imageSrc: "",
    tags: [],
    description: "",
    yearPublished: 0,
    votes: [],
};
