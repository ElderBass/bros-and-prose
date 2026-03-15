import type { ProseType } from "@/types";

export const getProseTypeColor = (type: ProseType): string => {
    switch (type) {
        case "creative":
            return "green";
        case "academic":
            return "lavender";
        case "poetic":
            return "pink";
        case "misc":
            return "yellow";
        default:
            return "blue";
    }
};
