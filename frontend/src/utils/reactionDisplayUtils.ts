import type { Comment } from "@/types";

/** Unique commenter usernames for reaction pill "who commented" lists. */
export function uniqueCommenterUsernames(
    comments: Comment[] | undefined
): string[] {
    if (!comments?.length) return [];
    const set = new Set<string>();
    for (const c of comments) {
        const u = c.userInfo?.username;
        if (u) set.add(u);
    }
    return [...set];
}
