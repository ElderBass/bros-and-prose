/**
 * CommonMark / Marked treat lines beginning with 4+ spaces (or a leading tab) as
 * **indented code blocks**. Script-style prose pasted from Docs often uses that
 * indentation, so the whole piece becomes one `<pre><code>` and looks like a snippet.
 *
 * This normalizes **non-fenced** regions only so markdown parses as paragraphs again.
 * Fenced ``` blocks are left unchanged.
 */

/** Tab counts as 4 columns for indent depth (CommonMark convention). */
function leadingSpaceColumns(line: string): number {
    let n = 0;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === " ") n += 1;
        else if (c === "\t") n += 4;
        else break;
    }
    return n;
}

/** Remove one indent unit: a tab or up to 4 spaces. */
function stripOneIndentUnit(line: string): string {
    if (line.startsWith("\t")) return line.slice(1);
    let i = 0;
    let removed = 0;
    while (i < line.length && removed < 4) {
        if (line[i] === " ") {
            i++;
            removed++;
        } else if (line[i] === "\t") {
            i++;
            removed = 4;
        } else break;
    }
    return line.slice(i);
}

function relaxIndentedCodeInSegment(segment: string): string {
    const lines = segment.split("\n");
    let out = lines;
    for (let guard = 0; guard < 1000; guard++) {
        let changed = false;
        out = out.map((line) => {
            if (!line.trim()) return line;
            if (leadingSpaceColumns(line) < 4) return line;
            changed = true;
            return stripOneIndentUnit(line);
        });
        if (!changed) break;
    }
    return out.join("\n");
}

/**
 * Split markdown into alternating [prose, fence, prose, fence, ...].
 * Opening ``` must appear in the string; closing ``` required for a fence segment.
 */
function splitPreservingFencedCode(markdown: string): string[] {
    const parts: string[] = [];
    let i = 0;
    while (i < markdown.length) {
        const start = markdown.indexOf("```", i);
        if (start === -1) {
            parts.push(markdown.slice(i));
            break;
        }
        if (start > i) {
            parts.push(markdown.slice(i, start));
        }
        const afterOpen = start + 3;
        const close = markdown.indexOf("```", afterOpen);
        if (close === -1) {
            parts.push(markdown.slice(start));
            break;
        }
        parts.push(markdown.slice(start, close + 3));
        i = close + 3;
    }
    return parts;
}

/**
 * Apply relaxIndentedCodeInSegment to every other chunk starting at index 0 (prose).
 */
export function normalizeIndentedProseMarkdown(markdown: string): string {
    const chunks = splitPreservingFencedCode(markdown);
    return chunks
        .map((chunk, idx) =>
            idx % 2 === 0 ? relaxIndentedCodeInSegment(chunk) : chunk
        )
        .join("");
}
