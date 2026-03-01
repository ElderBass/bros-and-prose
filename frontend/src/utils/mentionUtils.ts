import type { User } from "@/types";

/**
 * Extract all @username mentions from text
 * @param text - The text to extract mentions from
 * @returns Array of usernames (without the @ symbol)
 */
export function extractMentions(text: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const matches = text.matchAll(mentionRegex);
    return Array.from(matches, (match) => match[1]);
}

/**
 * Get user info for all mentioned usernames
 * @param text - The text containing mentions
 * @param allUsers - Array of all available users
 * @returns Array of User objects for mentioned users
 */
export function getMentionedUsers(text: string, allUsers: User[]): User[] {
    const mentionedUsernames = extractMentions(text);
    return allUsers.filter((user) =>
        mentionedUsernames.includes(user.username)
    );
}

/**
 * Parse text into segments of plain text and mentions
 * @param text - The text to parse
 * @returns Array of segments with type and value
 */
export function parseTextWithMentions(
    text: string
): Array<{ type: "text" | "mention"; value: string }> {
    const segments: Array<{ type: "text" | "mention"; value: string }> = [];
    const mentionRegex = /@(\w+)/g;
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
        // Add text before the mention
        if (match.index > lastIndex) {
            segments.push({
                type: "text",
                value: text.substring(lastIndex, match.index),
            });
        }

        // Add the mention (without the @ symbol)
        segments.push({
            type: "mention",
            value: match[1],
        });

        lastIndex = match.index + match[0].length;
    }

    // Add any remaining text after the last mention
    if (lastIndex < text.length) {
        segments.push({
            type: "text",
            value: text.substring(lastIndex),
        });
    }

    // If no mentions found, return the whole text as a single segment
    if (segments.length === 0) {
        segments.push({
            type: "text",
            value: text,
        });
    }

    return segments;
}

/**
 * Check if a text contains any mentions
 * @param text - The text to check
 * @returns True if text contains at least one mention
 */
export function hasMentions(text: string): boolean {
    return /@(\w+)/.test(text);
}
