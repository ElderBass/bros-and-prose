import DOMPurify from "dompurify";
import { marked } from "marked";

const V3_MARKED_OPTIONS = {
    gfm: true,
    breaks: true,
};

let domPurifyHooksRegistered = false;

function ensureDomPurifyLinkHook(): void {
    if (domPurifyHooksRegistered || typeof window === "undefined") return;
    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
        if (!(node instanceof HTMLElement) || node.tagName !== "A") return;
        const href = node.getAttribute("href")?.trim() ?? "";
        if (!/^https?:\/\//i.test(href)) {
            node.setAttribute("href", "#");
            node.removeAttribute("target");
            node.removeAttribute("rel");
            return;
        }
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
    });
    domPurifyHooksRegistered = true;
}

/**
 * V3 prose renderer: simple markdown with safe links and single-line breaks.
 */
export const renderMarkdownToSafeHtml = (markdown: string): string => {
    if (!markdown?.trim()) return "<p></p>";

    ensureDomPurifyLinkHook();

    const normalized = markdown.replace(/\t/g, "  ");
    const raw = marked.parse(normalized, {
        async: false,
        ...V3_MARKED_OPTIONS,
    }) as string;

    return DOMPurify.sanitize(raw, {
        USE_PROFILES: { html: true },
        ADD_ATTR: ["target", "rel", "class"],
    });
};

export const getPlainTextFromMarkdown = (markdown: string): string => {
    if (!markdown) return "";
    return markdown
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
        .replace(/\u00A0/g, " ")
        .replace(/[#>*_`~-]/g, " ")
        .replace(/\d+\.\s+/g, " ")
        .replace(/[-*]\s+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};
