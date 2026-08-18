<template>
    <div class="composer-view">
        <PageHeader
            :title="isEdit ? 'prune prose' : 'produce prose'"
            :fallback-to="backTarget"
        />

        <div class="composer-wrap">
            <div class="field">
                <label for="prose-title-v3">title</label>
                <BaseInput
                    id="prose-title-v3"
                    v-model="title"
                    label="prose title"
                    placeholder="give your prose a title"
                    size="medium"
                />
            </div>

            <div class="field">
                <label id="prose-type-v3-label">type</label>
                <ProseTypePillPicker
                    v-model="type"
                    :options="typeOptions"
                    labelled-by="prose-type-v3-label"
                />
            </div>

            <div class="field">
                <label for="prose-context-v3">context (optional)</label>
                <p class="format-hint">
                    attempt to justify why you birthed this monstrosity.
                </p>
                <MentionTextArea
                    id="prose-context-v3"
                    v-model="context"
                    label="prose context"
                    :rows="4"
                    :maxlength="600"
                    placeholder="a short context line or two..."
                />
                <p class="context-count">{{ contextCharCount }}/600</p>
            </div>

            <div class="field">
                <label for="prose-body-v3">body</label>
                <p class="format-hint">
                    markdown supports <strong>bold</strong>, <em>italic</em>,
                    links, and line breaks. <strong>Enter</strong> adds a line
                    break; <strong>Enter twice</strong> makes a new paragraph;
                    <strong>Tab</strong> adds indentation.
                </p>
                <CommonComposerEditor
                    v-model="markdown"
                    placeholder="write your prose... Enter for line break, Enter twice for paragraph, Tab for indent."
                    :autosave-label="autosaveLabel"
                />
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
        :prose-context="context"
        :prose-markdown="markdown"
        :preview-mode="true"
        :is-edit="isEdit"
        @confirm="handlePublishConfirm"
    />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import ComposerActions from "@/components/features/Prose/Composer/ComposerActions.vue";
import CommonComposerEditor from "@/components/features/Composer/CommonComposerEditor.vue";
import ProseTypePillPicker from "@/components/features/Prose/Composer/ProseTypePillPicker.vue";
import PublishProseConfirmModal from "@/components/features/Prose/PublishProseConfirmModal.vue";
import { PUBLISHED_PROSE_ENTRY_SUCCESS_ALERT, QUICK_ERROR } from "@/constants";
import { useLog } from "@/composables/useLog";
import { useProse } from "@/composables/useProse";
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
import { useRoute, useRouter } from "vue-router";

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

const getQueryString = (value: unknown) => {
    if (Array.isArray(value)) return String(value[0] ?? "");
    return typeof value === "string" ? value : "";
};

const prosePromptContextPrefill = computed(() => {
    const prompt = getQueryString(route.query.prompt).trim();
    const promptedBy = getQueryString(route.query.promptedBy).trim();
    if (!prompt || !promptedBy) return "";
    return `response to ${promptedBy}'s prompt of "${prompt}"`;
});

const title = ref("");
const type = ref<ProseType>("creative");
const context = ref("");
const markdown = ref("");
const submitting = ref(false);
const draftRestored = ref(false);
const lastSavedAt = ref("");
const editEntry = ref<ProseEntry | null>(null);
const showPublishConfirm = ref(false);

let draftSaveTimeout: ReturnType<typeof setTimeout> | null = null;

const typeOptions = [
    { label: "creative", value: "creative" },
    { label: "academic", value: "academic" },
    { label: "poetic", value: "poetic" },
    { label: "misc", value: "misc" },
] as const;

const getMarkdownForSave = (): string => markdown.value.trimEnd();

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
    const text = markdown.value.replace(/\u00A0/g, " ").trim();
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
});

const charCount = computed(() => markdown.value.trim().length);
const contextCharCount = computed(() => context.value.length);

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

const autosaveLabel = computed(() =>
    lastSavedLabel.value && !isEdit.value
        ? `saved that shit for ya bud ${lastSavedLabel.value}`
        : ""
);

const saveDraft = () => {
    if (isEdit.value || submitting.value) return;
    const hasDraftContent =
        title.value.trim().length > 0 ||
        context.value.trim().length > 0 ||
        markdown.value.trim().length > 0;
    if (!hasDraftContent) {
        clearProseDraft();
        lastSavedAt.value = "";
        return;
    }
    const savedAt = new Date().toISOString();
    const draft: ProseDraft = {
        title: title.value,
        type: type.value,
        context: context.value,
        markdown: markdown.value,
        savedAt,
    };
    setProseDraft(draft);
    lastSavedAt.value = savedAt;
};

watch([title, type, context, markdown], () => {
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

const getExcerptForSave = (): string => context.value.trim();

const buildProseEntry = (): ProseEntry => {
    return {
        id: uuidv4(),
        title: title.value.trim(),
        type: type.value,
        markdown: getMarkdownForSave(),
        excerpt: getExcerptForSave(),
        createdAt: new Date().toISOString(),
        userInfo: getUserInfo(loggedInUser.value),
        likes: [],
        dislikes: [],
        reactions: {},
        comments: [],
    };
};

const buildUpdatedEntry = (): ProseEntry => {
    const existing = editEntry.value!;
    return {
        ...existing,
        title: title.value.trim(),
        type: type.value,
        markdown: getMarkdownForSave(),
        excerpt: getExcerptForSave(),
    };
};

const onCancel = () => {
    router.back();
};

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
            showAlert(PUBLISHED_PROSE_ENTRY_SUCCESS_ALERT);
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

function handlePublishConfirm() {
    showPublishConfirm.value = false;
    const entry = isEdit.value ? buildUpdatedEntry() : buildProseEntry();
    submitEntry(entry);
}

onMounted(async () => {
    if (isEdit.value && proseId.value) {
        const stored = entries.value.find((e) => e.id === proseId.value);
        if (stored) {
            editEntry.value = stored;
            title.value = stored.title ?? "";
            type.value = stored.type ?? "creative";
            context.value = stored.context ?? stored.excerpt ?? "";
            markdown.value = stored.markdown ?? "";
        } else {
            const fetched = await getProseEntry(proseId.value);
            if (fetched) {
                editEntry.value = fetched;
                title.value = fetched.title ?? "";
                type.value = fetched.type ?? "creative";
                context.value = fetched.context ?? fetched.excerpt ?? "";
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
            context.value = draft.context ?? "";
            markdown.value = draft.markdown;
            draftRestored.value = true;
            lastSavedAt.value = draft.savedAt;
        } else {
            title.value = "";
            type.value = "creative";
            context.value = "";
            markdown.value = "";
            draftRestored.value = false;
            lastSavedAt.value = "";
        }

        if (prosePromptContextPrefill.value) {
            context.value = prosePromptContextPrefill.value;
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

.format-hint {
    margin: 0 0 0.15rem;
    padding: 0 0.35rem;
    font-size: 0.82rem;
    line-height: 1.4;
    color: var(--main-text);
    opacity: 0.78;
}

.format-hint strong {
    font-weight: 600;
    color: var(--accent-lavender);
}

.context-count {
    margin: 0;
    text-align: right;
    font-size: 0.78rem;
    opacity: 0.7;
    padding-right: 0.2rem;
}
</style>
