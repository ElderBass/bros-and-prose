import type { MarkedOptions } from "marked";

/**
 * If published prose looks wrong after a deploy, confirm the live bundle does not reintroduce
 * global `breaks: true`, `p + p` margins in MarkdownContent, or GDocs `transformPastedHTML`
 * blockquote hacks—this repo intentionally keeps `breaks: false` for stable legacy rendering.
 *
 * Single source of truth for prose markdown: must match between
 * - `renderMarkdownToSafeHtml` (detail view / MarkdownContent)
 * - TipTap `Markdown.configure({ markedOptions })` (ProseComposerV2)
 *
 * Keep `breaks: false` globally so legacy posts and lists are not flooded with `<br>`.
 * See revised prose layout plan for GDocs / “verse” opt-in strategies.
 */
export const PROSE_MARKED_OPTIONS: MarkedOptions = {
    gfm: true,
    breaks: false,
};

/**
 * How nested lists and code blocks are indented in serialized markdown (TipTap Markdown extension).
 * @see https://tiptap.dev/docs/editor/markdown/getting-started/installation#indentation-style
 */
export const PROSE_MARKDOWN_INDENTATION = {
    style: "space" as const,
    size: 2,
};
