import type { User } from "@/types";

const createMentionRegex = () => /(^|[^A-Za-z0-9._-])@([A-Za-z0-9_-]+)/g;

/**
 * Extract all @username mentions from text
 * @param text - The text to extract mentions from
 * @returns Array of usernames (without the @ symbol)
 */
export function extractMentions(text: string): string[] {
    const mentionRegex = createMentionRegex();
    const matches = text.matchAll(mentionRegex);
    return Array.from(matches, (match) => match[2]);
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
    const mentionRegex = createMentionRegex();
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
        const prefix = match[1] ?? "";
        const username = match[2];
        const mentionStart = match.index + prefix.length;
        const mentionEnd = mentionStart + username.length + 1;

        // Add text before the mention
        if (mentionStart > lastIndex) {
            segments.push({
                type: "text",
                value: text.substring(lastIndex, mentionStart),
            });
        }

        // Add the mention (without the @ symbol)
        segments.push({
            type: "mention",
            value: username,
        });

        lastIndex = mentionEnd;
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
    return createMentionRegex().test(text);
}
