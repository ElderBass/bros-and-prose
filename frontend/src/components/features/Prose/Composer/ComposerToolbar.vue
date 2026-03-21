<template>
    <div class="editor-toolbar">
        <ProseComposerToolButton
            title="bold, but not brave"
            @click="run(() => editor.chain().focus().toggleBold().run())"
        >
            <span class="tb-bold">B</span>
        </ProseComposerToolButton>
        <ProseComposerToolButton
            title="italicize me, cap'n"
            @click="run(() => editor.chain().focus().toggleItalic().run())"
        >
            <span class="tb-italic">I</span>
        </ProseComposerToolButton>
        <ProseComposerToolButton
            title="add a link (https://…)"
            @click="setLink"
        >
            <LinkIcon />
        </ProseComposerToolButton>
        <ProseComposerToolButton
            title="remove link"
            @click="run(() => editor.chain().focus().unsetLink().run())"
        >
            <span class="tb-unlink">⧉</span>
        </ProseComposerToolButton>
        <ProseComposerToolButton
            v-if="showAdvancedActions"
            title="bullet list"
            @click="run(() => editor.chain().focus().toggleBulletList().run())"
        >
            <span class="tb-list">•≡</span>
        </ProseComposerToolButton>
        <ProseComposerToolButton
            v-if="showAdvancedActions"
            title="numbered list"
            @click="run(() => editor.chain().focus().toggleOrderedList().run())"
        >
            <span class="tb-list">1.</span>
        </ProseComposerToolButton>
        <ProseComposerToolButton
            v-if="showAdvancedActions"
            title="heading 2"
            @click="
                run(() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                )
            "
        >
            H2
        </ProseComposerToolButton>
        <ProseComposerToolButton
            v-if="showAdvancedActions"
            title="heading 3"
            @click="
                run(() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                )
            "
        >
            H3
        </ProseComposerToolButton>
        <ProseComposerToolButton
            v-if="showAdvancedActions"
            title="undo"
            @click="run(() => editor.chain().focus().undo().run())"
        >
            ↺
        </ProseComposerToolButton>
        <ProseComposerToolButton
            v-if="showAdvancedActions"
            title="redo"
            @click="run(() => editor.chain().focus().redo().run())"
        >
            ↻
        </ProseComposerToolButton>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Editor as CoreEditor } from "@tiptap/core";
import LinkIcon from "@/components/icons/LinkIcon.vue";
import ProseComposerToolButton from "@/components/features/Prose/ProseComposerToolButton.vue";

defineOptions({ name: "ComposerToolbar" });

const props = defineProps<{
    /** TipTap editor instance (parent should only mount this when editor is ready). */
    editor: CoreEditor;
}>();

const showAdvancedActions = ref(false);

function run(fn: () => void) {
    fn();
}

function setLink() {
    const ed = props.editor;
    const previousUrl = ed.getAttributes("link").href as string | undefined;
    const url = window.prompt("link URL (https://…)", previousUrl ?? "");
    if (url === null) return;
    const trimmed = url.trim();
    if (trimmed === "") {
        ed.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
    }
    const withScheme = /^https?:\/\//i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;
    ed.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: withScheme })
        .run();
}
</script>

<style scoped>
.editor-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
}

.tb-bold {
    font-weight: bold;
}

.tb-italic {
    font-style: italic;
}

.tb-unlink {
    font-size: 1rem;
}

.tb-list {
    font-size: 1rem;
    font-weight: 600;
}
</style>
