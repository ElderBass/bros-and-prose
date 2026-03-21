<template>
    <div class="composer-view">
        <ProseViewHeader
            :title="isEdit ? 'prune prose' : 'produce prose'"
            :backTarget="backTarget"
        />

        <div class="composer-wrap">
            <div class="field">
                <label for="prose-title">title</label>
                <BaseInput
                    id="prose-title"
                    v-model="title"
                    label="prose title"
                    placeholder="give your prose a title"
                    size="medium"
                />
            </div>

            <div class="field">
                <label for="prose-type">type</label>
                <BaseSelect
                    id="prose-type"
                    v-model="type"
                    label="prose type"
                    :showLabel="false"
                    :options="typeOptions"
                    size="medium"
                />
            </div>

            <div class="field">
                <label for="prose-markdown">body</label>
                <div class="tools-wrapper">
                    <div class="editor-toolbar">
                        <ProseComposerToolButton
                            title="bold, but not brave"
                            @click="insertWrap('**', '**')"
                        >
                            <span style="font-weight: bold">B</span>
                        </ProseComposerToolButton>
                        <ProseComposerToolButton
                            title="italicize me, cap'n"
                            @click="insertWrap('*', '*')"
                        >
                            <span style="font-style: italic">I</span>
                        </ProseComposerToolButton>
                        <ProseComposerToolButton
                            title="header type of thing"
                            @click="insertLineStart('# ')"
                        >
                            H1
                        </ProseComposerToolButton>
                        <ProseComposerToolButton
                            title="slightly smaller header type of thing"
                            @click="insertLineStart('## ')"
                        >
                            H2
                        </ProseComposerToolButton>
                        <ProseComposerToolButton
                            title="hyperlink"
                            @click="insertWrap('[', '](url)')"
                        >
                            <LinkIcon />
                        </ProseComposerToolButton>
                    </div>
                    <p v-if="lastSavedLabel && !isEdit" class="autosave-status">
                        saved that shit for ya bud {{ lastSavedLabel }}
                    </p>
                </div>
                <div class="editor-area">
                    <textarea
                        ref="markdownTextareaRef"
                        id="prose-markdown"
                        :value="markdown"
                        class="prose-textarea"
                        placeholder="write your prose in markdown... paste from Word or Google Docs and formatting will be preserved."
                        :rows="18"
                        aria-label="prose markdown"
                        @input="
                            markdown = ($event.target as HTMLTextAreaElement)
                                .value
                        "
                        @paste="onPaste"
                        @keydown.tab.prevent="onTab"
                    />
                </div>
            </div>

            <div class="meta-row">
                <p v-if="validationMessage" class="hint">
                    {{ validationMessage }}
                </p>
                <p v-else-if="draftRestored" class="hint saved-hint">
                    draft restored, your ass is welcome
                </p>
                <span v-else class="stats"
                    >{{ wordCount }} words · {{ charCount }} characters</span
                >
                <div class="actions">
                    <BaseButton
                        variant="outline-secondary"
                        size="small"
                        title="cancel"
                        :showTooltip="false"
                        @click="onCancel"
                    >
                        cancel
                    </BaseButton>
                    <BaseButton
                        variant="success"
                        size="small"
                        :title="
                            submitDisabled
                                ? 'fill out required fields'
                                : isEdit
                                  ? 'save changes'
                                  : 'publish prose'
                        "
                        :showTooltip="false"
                        :disabled="submitDisabled || submitting"
                        @click="openPublishConfirm"
                    >
                        {{
                            submitting
                                ? isEdit
                                    ? "saving..."
                                    : "publishing..."
                                : isEdit
                                  ? "save"
                                  : "publish"
                        }}
                    </BaseButton>
                </div>
            </div>
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
import { v4 as uuidv4 } from "uuid";
import LinkIcon from "@/components/icons/LinkIcon.vue";
import ProseComposerToolButton from "@/components/features/Prose/ProseComposerToolButton.vue";
import { useProse } from "@/composables/useProse";
import { useProseStore } from "@/stores/prose";
import { useUserStore } from "@/stores/user";
import { useUIStore } from "@/stores/ui";
import { ADDED_COMMENT_SUCCESS_ALERT, QUICK_ERROR } from "@/constants";
import {
    clearProseDraft,
    getProseDraft,
    getUserInfo,
    htmlToMarkdown,
    setProseDraft,
} from "@/utils";
import { useLog } from "@/composables/useLog";
import type { ProseDraft, ProseEntry, ProseType } from "@/types";
import ProseViewHeader from "@/components/features/Prose/ProseViewHeader.vue";
import PublishProseConfirmModal from "@/components/features/Prose/PublishProseConfirmModal.vue";

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
const markdownTextareaRef = ref<HTMLTextAreaElement | null>(null);
const showPublishConfirm = ref(false);
let draftSaveTimeout: ReturnType<typeof setTimeout> | null = null;

const typeOptions = [
    { label: "creative", value: "creative" },
    { label: "academic", value: "academic" },
    { label: "poetic", value: "poetic" },
    { label: "misc", value: "misc" },
];

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
        return "";
    }
});

const resetForm = () => {
    title.value = "";
    type.value = "creative";
    markdown.value = "";
    draftRestored.value = false;
    lastSavedAt.value = "";
};

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

onBeforeUnmount(() => {
    if (draftSaveTimeout) {
        clearTimeout(draftSaveTimeout);
        draftSaveTimeout = null;
    }
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

function getTextareaSelection(): { start: number; end: number } {
    const el = markdownTextareaRef.value;
    if (!el) return { start: 0, end: 0 };
    return { start: el.selectionStart, end: el.selectionEnd };
}

function setTextareaSelection(start: number, end: number) {
    nextTick(() => {
        const el = markdownTextareaRef.value;
        if (el) {
            el.focus();
            el.setSelectionRange(start, end);
        }
    });
}

function insertWrap(before: string, after: string) {
    const { start, end } = getTextareaSelection();
    const selected = markdown.value.slice(start, end);
    const newText =
        markdown.value.slice(0, start) +
        before +
        selected +
        after +
        markdown.value.slice(end);
    markdown.value = newText;
    setTextareaSelection(start + before.length, end + before.length);
}

function insertLineStart(prefix: string) {
    const { start } = getTextareaSelection();
    const text = markdown.value;
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    const newText = text.slice(0, lineStart) + prefix + text.slice(lineStart);
    markdown.value = newText;
    setTextareaSelection(lineStart + prefix.length, lineStart + prefix.length);
}

function onTab(_: KeyboardEvent) {
    const el = markdownTextareaRef.value;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const insert = "    "; // 4 spaces for paragraph indent
    const newText =
        markdown.value.slice(0, start) + insert + markdown.value.slice(end);
    markdown.value = newText;
    setTextareaSelection(start + insert.length, start + insert.length);
}

function onPaste(e: ClipboardEvent) {
    const html = e.clipboardData?.getData("text/html");
    if (!html || !markdownTextareaRef.value) return;
    e.preventDefault();
    const md = htmlToMarkdown(html);
    if (!md) return;
    const el = markdownTextareaRef.value;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newText =
        markdown.value.slice(0, start) + md + markdown.value.slice(end);
    markdown.value = newText;
    setTextareaSelection(start + md.length, start + md.length);
}

function openPublishConfirm() {
    if (submitDisabled.value) return;
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
            resetForm();
        }
    }
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
}

.editor-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
}

.editor-area {
    min-height: 360px;
}

.prose-textarea {
    width: 100%;
    min-height: 360px;
    resize: vertical;
    border: 2px solid var(--accent-blue);
    border-radius: 0.5rem;
    padding: 0.75rem;
    font-family: "Crimson Text", serif;
    font-size: 1.125rem;
    color: var(--main-text);
    background-color: var(--background-color);
    box-sizing: border-box;
}

.prose-textarea::placeholder {
    color: var(--main-text);
    opacity: 0.6;
}

.prose-textarea:focus {
    outline: none;
    border-color: var(--accent-lavender);
}

.meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
}

.hint {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.8;
}

.saved-hint {
    color: var(--accent-green);
}

.stats {
    font-size: 0.85rem;
    opacity: 0.75;
}

.autosave-status {
    margin: 0;
    font-size: 0.82rem;
    color: var(--main-text);
    opacity: 0.72;
    text-align: right;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.65rem;
}
</style>
