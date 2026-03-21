<template>
    <div class="composer-view">
        <ProseViewHeader
            :title="isEdit ? 'prune prose' : 'produce prose'"
            :backTarget="backTarget"
        />

        <div class="composer-wrap">
            <div class="field">
                <label for="prose-title-v2">title</label>
                <BaseInput
                    id="prose-title-v2"
                    v-model="title"
                    label="prose title"
                    placeholder="give your prose a title"
                    size="medium"
                />
            </div>

            <div class="field">
                <label for="prose-type-v2">type</label>
                <BaseSelect
                    id="prose-type-v2"
                    v-model="type"
                    label="prose type"
                    :showLabel="false"
                    :options="typeOptions"
                    size="medium"
                />
            </div>

            <div class="field">
                <label for="prose-body-v2">body</label>
                <div class="tools-wrapper">
                    <ComposerToolbar v-if="editor" :editor="editor" />
                    <p v-if="lastSavedLabel && !isEdit" class="autosave-status">
                        saved that shit for ya bud {{ lastSavedLabel }}
                    </p>
                </div>
                <div class="editor-area">
                    <editor-content
                        v-if="editor"
                        :editor="editor"
                        class="editor-content-host"
                    />
                    <div v-else class="editor-loading">loading editor…</div>
                </div>
            </div>

            <ComposerActions
                :validation-message="validationMessage"
                :draft-restored="draftRestored"
                :word-count="wordCount"
                :char-count="charCount"
                :submit-disabled="submitDisabled"
                :submitting="submitting"
                :is-edit="isEdit"
                @cancel="onCancel"
                @submit="openPublishConfirm"
            />
        </div>
    </div>

    <PublishProseConfirmModal
        v-model="showPublishConfirm"
        :prose-title="title"
        :prose-type="type"
        :initial-blurb="editEntry?.excerpt ?? ''"
        :is-edit="isEdit"
        @confirm="handlePublishConfirm"
    />
</template>

<script setup lang="ts">
import type { Editor as CoreEditor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import Link from "@tiptap/extension-link";
import { Markdown } from "@tiptap/markdown";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { v4 as uuidv4 } from "uuid";
import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import ComposerActions from "@/components/features/Prose/Composer/ComposerActions.vue";
import ComposerToolbar from "@/components/features/Prose/Composer/ComposerToolbar.vue";
import PublishProseConfirmModal from "@/components/features/Prose/PublishProseConfirmModal.vue";
import ProseViewHeader from "@/components/features/Prose/ProseViewHeader.vue";
import { ADDED_COMMENT_SUCCESS_ALERT, QUICK_ERROR } from "@/constants";
import { useProse } from "@/composables/useProse";
import { useLog } from "@/composables/useLog";
import { useProseStore } from "@/stores/prose";
import { useUIStore } from "@/stores/ui";
import { useUserStore } from "@/stores/user";
import type { ProseDraft, ProseEntry, ProseType } from "@/types";
import {
    clearProseDraft,
    getProseDraft,
    getUserInfo,
    setProseDraft,
} from "@/utils";

const route = useRoute();
const router = useRouter();
const { createProseEntry, updateProseEntry, getProseEntry } = useProse();

const { entries } = storeToRefs(useProseStore());
const { loggedInUser } = storeToRefs(useUserStore());
const { showAlert } = useUIStore();

const proseId = computed(() => route.params.proseId as string | undefined);
const isEdit = computed(() => Boolean(proseId.value));

const backTarget = computed(() =>
    isEdit.value && proseId.value ? `/prose/${proseId.value}` : "/prose"
);

const title = ref("");
const type = ref<ProseType>("creative");
const markdown = ref("");
const submitting = ref(false);
const draftRestored = ref(false);
const lastSavedAt = ref("");
const editEntry = ref<ProseEntry | null>(null);
const showPublishConfirm = ref(false);
const dataLoaded = ref(false);

let draftSaveTimeout: ReturnType<typeof setTimeout> | null = null;
let markdownSyncTimeout: ReturnType<typeof setTimeout> | null = null;

const typeOptions = [
    { label: "creative", value: "creative" },
    { label: "academic", value: "academic" },
    { label: "poetic", value: "poetic" },
    { label: "misc", value: "misc" },
];

function getMarkdownFromEditor(ed: CoreEditor): string {
    const withMd = ed as unknown as { getMarkdown?: () => string };
    return withMd.getMarkdown?.() ?? "";
}

function scheduleMarkdownSync(ed: CoreEditor) {
    if (markdownSyncTimeout) clearTimeout(markdownSyncTimeout);
    markdownSyncTimeout = setTimeout(() => {
        markdown.value = getMarkdownFromEditor(ed);
        markdownSyncTimeout = null;
    }, 400);
}

const editor = useEditor({
    extensions: [
        StarterKit.configure({
            heading: { levels: [1, 2, 3, 4, 5, 6] },
        }),
        Markdown.configure({
            markedOptions: { gfm: true },
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
            placeholder:
                "write your prose… use the toolbar for bold, links, and lists.",
        }),
    ],
    content: "",
    contentType: "markdown",
    editorProps: {
        attributes: {
            class: "tiptap-prose-mirror",
            spellcheck: "true",
        },
    },
    onUpdate: ({ editor: ed }) => {
        scheduleMarkdownSync(ed);
    },
});

const validationMessage = computed(() => {
    const trimmedTitle = title.value.trim();
    const trimmedMarkdown = markdown.value.trim();
    if (trimmedTitle.length < 3) return "title needs at least 3 characters";
    if (trimmedTitle.length > 120) return "title max length is 120 characters";
    if (trimmedMarkdown.length < 20) return "body needs at least 20 characters";
    return "";
});

const submitDisabled = computed(() => Boolean(validationMessage.value));

const wordCount = computed(() => {
    const text = markdown.value.trim();
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
});

const charCount = computed(() => markdown.value.trim().length);

const lastSavedLabel = computed(() => {
    if (!lastSavedAt.value) return "";
    try {
        return new Date(lastSavedAt.value).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return lastSavedAt.value;
    }
});

const saveDraft = () => {
    if (isEdit.value || submitting.value) return;
    const hasDraftContent =
        title.value.trim().length > 0 || markdown.value.trim().length > 0;
    if (!hasDraftContent) {
        clearProseDraft();
        lastSavedAt.value = "";
        return;
    }
    const savedAt = new Date().toISOString();
    const draft: ProseDraft = {
        title: title.value,
        type: type.value,
        markdown: markdown.value,
        savedAt,
    };
    setProseDraft(draft);
    lastSavedAt.value = savedAt;
};

watch([title, type, markdown], () => {
    if (isEdit.value) return;
    if (draftSaveTimeout) clearTimeout(draftSaveTimeout);
    draftSaveTimeout = setTimeout(saveDraft, 500);
});

watch(
    [editor, dataLoaded],
    ([ed, loaded]) => {
        if (!ed || !loaded) return;
        ed.commands.setContent(markdown.value || "", {
            contentType: "markdown",
        });
    },
    { flush: "post" }
);

onBeforeUnmount(() => {
    if (draftSaveTimeout) {
        clearTimeout(draftSaveTimeout);
        draftSaveTimeout = null;
    }
    if (markdownSyncTimeout) {
        clearTimeout(markdownSyncTimeout);
        markdownSyncTimeout = null;
    }
    editor.value?.destroy();
});

const buildProseEntry = (blurb?: string): ProseEntry => {
    const excerpt = blurb?.trim() ? blurb.trim() : "";
    return {
        id: uuidv4(),
        title: title.value.trim(),
        type: type.value,
        markdown: markdown.value.trim(),
        excerpt,
        createdAt: new Date().toISOString(),
        userInfo: getUserInfo(loggedInUser.value),
        likes: [],
        dislikes: [],
        comments: [],
    };
};

const buildUpdatedEntry = (blurb?: string): ProseEntry => {
    const existing = editEntry.value!;
    const excerpt = blurb?.trim() ? blurb.trim() : "";
    return {
        ...existing,
        title: title.value.trim(),
        type: type.value,
        markdown: markdown.value.trim(),
        excerpt,
    };
};

const onCancel = () => {
    router.back();
};

function openPublishConfirm() {
    if (submitDisabled.value) return;
    const ed = editor.value;
    if (ed) {
        markdown.value = getMarkdownFromEditor(ed);
    }
    showPublishConfirm.value = true;
}

async function submitEntry(entry: ProseEntry) {
    submitting.value = true;
    try {
        if (isEdit.value) {
            await updateProseEntry(entry);
            showAlert({
                show: true,
                messages: ["prose pruned.", "your effort is cute, if futile."],
                type: "success",
                duration: 3000,
                dismissable: false,
            });
            router.push(`/prose/${entry.id}`);
        } else {
            await createProseEntry(entry);
            clearProseDraft();
            lastSavedAt.value = "";
            draftRestored.value = false;
            showAlert({
                ...ADDED_COMMENT_SUCCESS_ALERT,
                messages: [
                    "prose published successfully.",
                    "your piece (of shit) is now live. ugh.",
                ],
            });
            router.push("/prose");
        }
    } catch (error) {
        console.error(
            isEdit.value
                ? "Error updating prose entry:"
                : "Error creating prose entry:",
            error
        );
        await useLog().error(
            `Error ${isEdit.value ? "updating" : "creating"} prose entry: ${error}`
        );
        const verb = isEdit.value ? "update" : "publish";
        showAlert(
            QUICK_ERROR([
                `failed to ${verb} prose`,
                (error as Error).message || "unknown error",
            ])
        );
    } finally {
        submitting.value = false;
    }
}

function handlePublishConfirm(blurb: string) {
    showPublishConfirm.value = false;
    const entry = isEdit.value
        ? buildUpdatedEntry(blurb)
        : buildProseEntry(blurb);
    submitEntry(entry);
}

onMounted(async () => {
    dataLoaded.value = false;
    if (isEdit.value && proseId.value) {
        const stored = entries.value.find((e) => e.id === proseId.value);
        if (stored) {
            editEntry.value = stored;
            title.value = stored.title ?? "";
            type.value = stored.type ?? "creative";
            markdown.value = stored.markdown ?? "";
        } else {
            const fetched = await getProseEntry(proseId.value);
            if (fetched) {
                editEntry.value = fetched;
                title.value = fetched.title ?? "";
                type.value = fetched.type ?? "creative";
                markdown.value = fetched.markdown ?? "";
            } else {
                router.replace("/prose");
                return;
            }
        }
    } else {
        const draft = getProseDraft();
        if (draft) {
            title.value = draft.title;
            type.value = draft.type;
            markdown.value = draft.markdown;
            draftRestored.value = true;
            lastSavedAt.value = draft.savedAt;
        } else {
            title.value = "";
            type.value = "creative";
            markdown.value = "";
            draftRestored.value = false;
            lastSavedAt.value = "";
        }
    }
    await nextTick();
    dataLoaded.value = true;
});
</script>

<style scoped>
.composer-view {
    width: 100%;
    max-width: 820px;
    margin: 0 auto;
    padding-bottom: 0;
}

.composer-wrap {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

label {
    color: var(--accent-blue);
    font-size: 1.1rem;
    padding-left: 0.35rem;
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

/* TipTap / ProseMirror */
:deep(.tiptap-prose-mirror) {
    outline: none;
    min-height: 320px;
    padding: 0.75rem;
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

:deep(.tiptap-prose-mirror h1),
:deep(.tiptap-prose-mirror h2),
:deep(.tiptap-prose-mirror h3),
:deep(.tiptap-prose-mirror h4) {
    color: var(--accent-blue);
    margin: 0.5rem 0 0.35rem;
    line-height: 1.25;
}

:deep(.tiptap-prose-mirror ul),
:deep(.tiptap-prose-mirror ol) {
    margin: 0.35rem 0 0.5rem 1.25rem;
    padding: 0;
}

:deep(.tiptap-prose-mirror li) {
    margin: 0.15rem 0;
}

:deep(.tiptap-prose-mirror blockquote) {
    margin: 0.5rem 0;
    padding-left: 0.65rem;
    border-left: 3px solid var(--accent-lavender);
    opacity: 0.95;
}

:deep(.tiptap-prose-mirror a) {
    color: var(--accent-fuschia);
    text-decoration: underline;
    cursor: pointer;
}

:deep(.tiptap-prose-mirror pre) {
    margin: 0.5rem 0;
    padding: 0.5rem 0.65rem;
    border-radius: 0.35rem;
    background: rgba(255, 255, 255, 0.06);
    overflow-x: auto;
    font-size: 0.92em;
}

:deep(.tiptap-prose-mirror code) {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 0.25rem;
    padding: 0.05rem 0.3rem;
    font-size: 0.92em;
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
