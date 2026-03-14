<template>
    <BaseModal
        :modelValue="open"
        @close="closeModal"
        title="write prose"
        size="large"
        shadow-color="fuschia"
    >
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
                <div class="markdown-label-row">
                    <label for="prose-markdown">markdown</label>
                    <BaseButton
                        variant="outline-tertiary"
                        size="xsmall"
                        title="toggle preview"
                        :showTooltip="false"
                        @click="showPreview = !showPreview"
                    >
                        {{ showPreview ? "edit" : "preview" }}
                    </BaseButton>
                </div>

                <BaseTextArea
                    v-if="!showPreview"
                    id="prose-markdown"
                    v-model="markdown"
                    label="prose markdown"
                    placeholder="write your prose in markdown..."
                    :rows="12"
                />
                <div v-else class="preview-panel">
                    <MarkdownContent :markdown="markdown" />
                </div>
            </div>

            <div class="meta-row">
                <p class="hint" v-if="validationMessage">
                    {{ validationMessage }}
                </p>
                <p v-else-if="draftRestored" class="hint saved-hint">
                    draft restored, your ass is welcome
                </p>
                <span class="char-count"
                    >{{ markdown.trim().length }}/6000</span
                >
            </div>
            <p v-if="lastSavedLabel" class="autosave-status">
                saved that shit for ya bud {{ lastSavedLabel }}
            </p>

            <div class="actions">
                <BaseButton
                    variant="outline-secondary"
                    size="small"
                    title="cancel prose draft"
                    :showTooltip="false"
                    @click="closeModal"
                >
                    cancel
                </BaseButton>
                <BaseButton
                    variant="success"
                    size="small"
                    :title="
                        submitDisabled
                            ? 'fill out required fields'
                            : 'publish prose'
                    "
                    :showTooltip="false"
                    :disabled="submitDisabled || submitting"
                    @click="submit"
                >
                    {{ submitting ? "publishing..." : "publish" }}
                </BaseButton>
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import BaseSelect from "@/components/form/BaseSelect.vue";
import BaseTextArea from "@/components/form/BaseTextArea.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import MarkdownContent from "@/components/features/common/MarkdownContent.vue";
import { useProse } from "@/composables/useProse";
import { useUserStore } from "@/stores/user";
import { useUIStore } from "@/stores/ui";
import { ADDED_COMMENT_SUCCESS_ALERT, QUICK_ERROR } from "@/constants";
import {
    clearProseDraft,
    getPlainTextFromMarkdown,
    getProseDraft,
    getUserInfo,
    setProseDraft,
} from "@/utils";
import { useLog } from "@/composables/useLog";
import type { ProseDraft, ProseEntry, ProseType } from "@/types";

const props = withDefaults(
    defineProps<{
        open: boolean;
    }>(),
    {
        open: false,
    }
);

const emit = defineEmits<{
    (e: "close"): void;
    (e: "created", entry: ProseEntry): void;
}>();

const { createProseEntry } = useProse();
const { loggedInUser } = storeToRefs(useUserStore());
const { showAlert } = useUIStore();

const title = ref("");
const type = ref<ProseType>("creative");
const markdown = ref("");
const showPreview = ref(false);
const submitting = ref(false);
const draftRestored = ref(false);
const lastSavedAt = ref("");
let draftSaveTimeout: ReturnType<typeof setTimeout> | null = null;

const typeOptions = [
    { label: "creative", value: "creative" },
    { label: "academic", value: "academic" },
    { label: "poetic", value: "poetic" },
    { label: "misc", value: "misc" },
];

const resetForm = () => {
    title.value = "";
    type.value = "creative";
    markdown.value = "";
    showPreview.value = false;
    submitting.value = false;
    draftRestored.value = false;
    lastSavedAt.value = "";
};

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
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
        } else if (draftSaveTimeout) {
            clearTimeout(draftSaveTimeout);
            draftSaveTimeout = null;
        }
    }
);

const saveDraft = () => {
    if (!props.open || submitting.value) return;

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
    if (!props.open) return;

    if (draftSaveTimeout) {
        clearTimeout(draftSaveTimeout);
    }
    draftSaveTimeout = setTimeout(() => {
        saveDraft();
    }, 500);
});

onBeforeUnmount(() => {
    if (draftSaveTimeout) {
        clearTimeout(draftSaveTimeout);
    }
});

const validationMessage = computed(() => {
    const trimmedTitle = title.value.trim();
    const trimmedMarkdown = markdown.value.trim();

    if (trimmedTitle.length < 3) return "title needs at least 3 characters";
    if (trimmedTitle.length > 120) return "title max length is 120 characters";
    if (trimmedMarkdown.length < 20)
        return "markdown needs at least 20 characters";
    if (trimmedMarkdown.length > 6000)
        return "markdown max length is 6000 characters";
    return "";
});

const submitDisabled = computed(() => {
    return Boolean(validationMessage.value) || !loggedInUser.value?.id;
});

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

const buildProseEntry = (): ProseEntry => {
    const plainText = getPlainTextFromMarkdown(markdown.value);

    return {
        id: uuidv4(),
        title: title.value.trim(),
        type: type.value,
        markdown: markdown.value.trim(),
        excerpt: plainText.slice(0, 240),
        createdAt: new Date().toISOString(),
        userInfo: getUserInfo(loggedInUser.value),
        likes: [],
        dislikes: [],
        comments: [],
    };
};

const closeModal = () => {
    emit("close");
};

const submit = async () => {
    if (submitDisabled.value) return;

    const entry = buildProseEntry();
    submitting.value = true;

    try {
        await createProseEntry(entry);
        clearProseDraft();
        lastSavedAt.value = "";
        draftRestored.value = false;
        showAlert({
            ...ADDED_COMMENT_SUCCESS_ALERT,
            messages: [
                "prose published successfully.",
                "your piece is now live.",
            ],
        });
        emit("created", entry);
        emit("close");
    } catch (error) {
        console.error("Error creating prose entry:", error);
        await useLog().error(`Error creating prose entry: ${error}`);
        showAlert(
            QUICK_ERROR([
                "failed to publish prose",
                (error as Error).message || "unknown error",
            ])
        );
    } finally {
        submitting.value = false;
    }
};
</script>

<style scoped>
.composer-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
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

.markdown-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.6rem;
}

.preview-panel {
    border: 1px solid var(--accent-lavender);
    border-radius: 0.6rem;
    padding: 0.8rem;
    min-height: 220px;
    max-height: 360px;
    overflow-y: auto;
    background: rgba(179, 136, 255, 0.08);
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

.char-count {
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

@media (max-width: 768px) {
    .actions {
        flex-direction: column-reverse;
        align-items: stretch;
    }
}
</style>
