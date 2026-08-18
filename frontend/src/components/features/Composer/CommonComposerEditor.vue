<template>
    <div class="common-composer-editor">
        <div class="tools-wrapper">
            <ComposerToolbar v-if="editor && showToolbar" :editor="editor" />
            <p v-if="autosaveLabel" class="autosave-status">
                {{ autosaveLabel }}
            </p>
        </div>
        <div class="editor-area" @click="focusEditor">
            <editor-content
                v-if="editor"
                :editor="editor"
                class="editor-content-host"
            />
            <div v-else class="editor-loading">loading editor...</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Extension, type Editor as CoreEditor } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import { Markdown } from "@tiptap/markdown";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import { onBeforeUnmount, watch } from "vue";
import ComposerToolbar from "@/components/features/Prose/Composer/ComposerToolbar.vue";
import { PROSE_MARKDOWN_INDENTATION } from "@/utils/proseMarkedConfig";

defineOptions({ name: "CommonComposerEditor" });

const INDENT_TOKEN = "\u00A0\u00A0\u00A0\u00A0";

const CommonComposerShortcuts = Extension.create({
    name: "commonComposerShortcuts",
    addKeyboardShortcuts() {
        return {
            Tab: () => this.editor.commands.insertContent(INDENT_TOKEN),
        };
    },
});

const props = withDefaults(
    defineProps<{
        modelValue: string;
        placeholder?: string;
        showToolbar?: boolean;
        autosaveLabel?: string;
    }>(),
    {
        placeholder:
            "write something... Enter for line break, Enter twice for paragraph, Tab for indent.",
        showToolbar: true,
        autosaveLabel: "",
    }
);

const emit = defineEmits<{
    "update:modelValue": [value: string];
}>();

function getMarkdownFromEditor(ed: CoreEditor): string {
    const withMd = ed as unknown as { getMarkdown?: () => string };
    return withMd.getMarkdown?.() ?? "";
}

const editor = useEditor({
    extensions: [
        StarterKit.configure({
            heading: false,
            blockquote: false,
            bulletList: false,
            orderedList: false,
            listItem: false,
            code: false,
            codeBlock: false,
            horizontalRule: false,
            strike: false,
        }),
        Markdown.configure({
            indentation: PROSE_MARKDOWN_INDENTATION,
            markedOptions: {
                gfm: true,
                breaks: true,
            },
        }),
        Link.configure({
            openOnClick: false,
            autolink: true,
            defaultProtocol: "https",
            HTMLAttributes: {
                class: "prose-editor-link",
            },
        }),
        Placeholder.configure({
            placeholder: props.placeholder,
        }),
        CommonComposerShortcuts,
    ],
    content: props.modelValue || "",
    contentType: "markdown",
    editorProps: {
        attributes: {
            class: "tiptap-prose-mirror",
            spellcheck: "true",
        },
    },
    onUpdate: ({ editor: ed }) => {
        emit("update:modelValue", getMarkdownFromEditor(ed));
    },
});

watch(
    () => props.modelValue,
    (markdown) => {
        const ed = editor.value;
        if (!ed || getMarkdownFromEditor(ed) === markdown) return;
        ed.commands.setContent(markdown || "", {
            contentType: "markdown",
        });
    },
    { flush: "post" }
);

const focusEditor = () => {
    editor.value?.chain().focus().run();
};

onBeforeUnmount(() => {
    editor.value?.destroy();
});
</script>

<style scoped>
.common-composer-editor {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.tools-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.editor-area {
    min-height: 480px;
    border: 2px solid var(--accent-blue);
    border-radius: 0.5rem;
    background-color: var(--background-color);
    box-sizing: border-box;
    transition: border-color 0.2s ease;
    padding: 0.5rem;
}

.editor-area:focus-within {
    border-color: var(--accent-lavender);
}

.editor-content-host {
    min-height: 360px;
}

.editor-loading {
    min-height: 360px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    font-style: italic;
}

.autosave-status {
    margin: 0;
    font-size: 0.82rem;
    color: var(--main-text);
    opacity: 0.72;
    text-align: right;
}

:deep(.tiptap-prose-mirror) {
    outline: none;
    min-height: 320px;
    padding: 1.1rem 1.2rem;
    font-family: "Crimson Text", serif;
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--main-text);
}

:deep(.tiptap-prose-mirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: var(--main-text);
    opacity: 0.45;
    pointer-events: none;
    height: 0;
}

:deep(.tiptap-prose-mirror p) {
    margin: 0 0 0.5rem;
}

:deep(.tiptap-prose-mirror a) {
    color: var(--accent-fuschia);
    text-decoration: underline;
    cursor: pointer;
}

@media (max-width: 768px) {
    :deep(.tiptap-prose-mirror) {
        font-size: 1rem;
        min-height: 280px;
    }

    .editor-area,
    .editor-content-host,
    .editor-loading {
        min-height: 360px;
    }
}
</style>
