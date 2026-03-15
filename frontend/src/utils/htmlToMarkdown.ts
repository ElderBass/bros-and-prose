import TurndownService from "turndown";

let turndownInstance: TurndownService | null = null;

function getTurndown(): TurndownService {
    if (!turndownInstance) {
        turndownInstance = new TurndownService({ headingStyle: "atx" });
    }
    return turndownInstance;
}

/**
 * Converts HTML to markdown (e.g. for paste from Word/Google Docs).
 */
export function htmlToMarkdown(html: string): string {
    const trimmed = html.trim();
    if (!trimmed) return "";
    try {
        return getTurndown().turndown(trimmed);
    } catch {
        return trimmed;
    }
}
