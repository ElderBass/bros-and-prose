const LOWERCASE_WORDS = [
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "if",
    "then",
    "else",
    "of",
    "in",
    "to",
    "from",
    "with",
    "as",
    "at",
    "by",
    "for",
    "on",
    "off",
    "up",
    "down",
    "out",
    "over",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
];

export const capitalizeBookTitle = (title: string) => {
    return title
        .split(" ")
        .map((word) => {
            if (LOWERCASE_WORDS.includes(word)) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
};
