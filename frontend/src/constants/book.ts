import type { Book, BookshelfBook, User } from "@/types";

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

export const EMPTY_SHELF_BOOK: BookshelfBook = {
    id: "",
    title: "",
    author: "",
    imageSrc: "",
    tags: [],
    description: "",
    yearPublished: 1969,
    pages: 0,
};

export const ON_DECK_BOOK_SELECTOR = "chris_dub";

export const ARCHIVE_ENABLED = false;

export const COMMON_BOOK_TAGS = [
    "absurdist",
    "adventure",
    "alt history",
    "anthology",
    "anthropology",
    "art",
    "atmospheric",
    "avant-garde",
    "biography",
    "bleak",
    "business",
    "campy",
    "cerebral",
    "character-driven",
    "classic",
    "coming-of-age",
    "cosmic horror",
    "cozy",
    "cyberpunk",
    "dark comedy",
    "dystopian",
    "economics",
    "education",
    "experimental",
    "fantasy",
    "fast-paced",
    "finance",
    "graphic novel",
    "gritty",
    "gut-wrenching",
    "heist",
    "historical",
    "history",
    "horror",
    "humor",
    "leadership",
    "literary",
    "lovecraftian",
    "medicine",
    "memoir",
    "metafiction",
    "music",
    "multiple POVs",
    "mystery",
    "nature",
    "neuroscience",
    "noir",
    "nonfiction",
    "occult",
    "paranormal",
    "philosophy",
    "picaresque",
    "plot-driven",
    "poetry",
    "political",
    "pop-culture",
    "post-apocalyptic",
    "psychology",
    "religion",
    "romance",
    "romantasy",
    "satire",
    "sentimental",
    "sci-fi",
    "science",
    "self-help",
    "short stories",
    "slow burn",
    "series",
    "social justice",
    "sociology",
    "space opera",
    "sports",
    "spirituality",
    "steampunk",
    "tech",
    "thriller",
    "time travel",
    "tragedy",
    "travel",
    "true crime",
    "uplifting",
    "western",
    "wholesome",
    "YA",
];
