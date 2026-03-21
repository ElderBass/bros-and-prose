import DOMPurify from "dompurify";
import { marked } from "marked";

marked.use({
    gfm: true,
    breaks: false,
});

let domPurifyHooksRegistered = false;

function ensureDomPurifyLinkHook(): void {
    if (domPurifyHooksRegistered || typeof window === "undefined") return;
    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
        if (node instanceof HTMLElement && node.tagName === "A") {
            const href = node.getAttribute("href");
            if (href && /^https?:\/\//i.test(href)) {
                node.setAttribute("target", "_blank");
                node.setAttribute("rel", "noopener noreferrer");
            }
        }
    });
    domPurifyHooksRegistered = true;
}

/**
 * Renders markdown to safe HTML for display (e.g. prose body).
 * Uses Marked (GFM) + DOMPurify so output matches TipTap `@tiptap/markdown` serialization.
 */
export const renderMarkdownToSafeHtml = (markdown: string): string => {
    if (!markdown?.trim()) return "<p></p>";

    ensureDomPurifyLinkHook();

    const raw = marked.parse(markdown, { async: false }) as string;

    return DOMPurify.sanitize(raw, {
        USE_PROFILES: { html: true },
        ADD_ATTR: ["target", "rel", "class"],
    });
};

export const getPlainTextFromMarkdown = (markdown: string): string => {
    if (!markdown) return "";
    return markdown
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
        .replace(/[#>*_`~-]/g, " ")
        .replace(/\d+\.\s+/g, " ")
        .replace(/[-*]\s+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};
