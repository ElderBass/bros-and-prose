const LOWERCASE_NAME_PREFIXES = ["de", "van", "der"];

export const capitalizeAuthorName = (author: string) => {
    return author
        .split(" ")
        .map((word) => {
            if (LOWERCASE_NAME_PREFIXES.includes(word)) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
};
