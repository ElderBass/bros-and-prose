const escapeHtml = (text: string): string => {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

const sanitizeUrl = (url: string): string => {
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) {
        return escapeHtml(trimmed);
    }
    return "#";
};

const formatInline = (text: string): string => {
    let formatted = text;

    // links: [text](https://example.com)
    formatted = formatted.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        (_match, label: string, url: string) => {
            const safeUrl = sanitizeUrl(url);
            return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`;
        }
    );

    // inline code: `code`
    formatted = formatted.replace(/`([^`]+)`/g, "<code>$1</code>");

    // bold: **text**
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // italic: *text*
    formatted = formatted.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    return formatted;
};

export const renderMarkdownToSafeHtml = (markdown: string): string => {
    if (!markdown?.trim()) return "<p></p>";

    const escaped = escapeHtml(markdown);
    const lines = escaped.split("\n");
    const htmlParts: string[] = [];

    let inUl = false;
    let inOl = false;

    const closeLists = () => {
        if (inUl) {
            htmlParts.push("</ul>");
            inUl = false;
        }
        if (inOl) {
            htmlParts.push("</ol>");
            inOl = false;
        }
    };

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) {
            closeLists();
            continue;
        }

        const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
            closeLists();
            const level = headingMatch[1].length;
            htmlParts.push(
                `<h${level}>${formatInline(headingMatch[2])}</h${level}>`
            );
            continue;
        }

        const ulMatch = trimmed.match(/^[-*]\s+(.+)$/);
        if (ulMatch) {
            if (inOl) {
                htmlParts.push("</ol>");
                inOl = false;
            }
            if (!inUl) {
                htmlParts.push("<ul>");
                inUl = true;
            }
            htmlParts.push(`<li>${formatInline(ulMatch[1])}</li>`);
            continue;
        }

        const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
        if (olMatch) {
            if (inUl) {
                htmlParts.push("</ul>");
                inUl = false;
            }
            if (!inOl) {
                htmlParts.push("<ol>");
                inOl = true;
            }
            htmlParts.push(`<li>${formatInline(olMatch[1])}</li>`);
            continue;
        }

        const quoteMatch = trimmed.match(/^>\s+(.+)$/);
        if (quoteMatch) {
            closeLists();
            htmlParts.push(
                `<blockquote>${formatInline(quoteMatch[1])}</blockquote>`
            );
            continue;
        }

        closeLists();
        htmlParts.push(`<p>${formatInline(trimmed)}</p>`);
    }

    closeLists();

    return htmlParts.join("");
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
