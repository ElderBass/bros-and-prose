<template>
    <BaseModal
        :modelValue="modelValue"
        :title="modalTitle"
        size="large"
        shadow-color="green"
        @update:modelValue="$emit('update:modelValue', $event)"
        @close="onClose"
    >
        <div class="preview-wrap">
            <div class="preview-header">
                <p class="kicker">preview</p>
                <p class="subcopy">
                    scroll through your piece before
                    {{ isEdit ? "saving" : "publishing" }}.
                </p>
            </div>
            <div v-if="isPreviewMode" class="preview-surface">
                <div class="title-row">
                    <h3 class="preview-title">
                        {{ proseTitle.trim() || "untitled prose" }}
                    </h3>
                    <span class="type-pill">{{ proseType }}</span>
                </div>
                <p v-if="previewContext" class="preview-excerpt">
                    {{ previewContext }}
                </p>
                <div
                    class="preview-markdown"
                    v-html="renderedPreviewMarkdown"
                ></div>
            </div>
            <div v-else class="legacy-surface">
                <div class="summary-row">
                    <span class="kicker">title</span>
                    <span class="preview-title">{{
                        proseTitle.trim() || "untitled prose"
                    }}</span>
                </div>
                <div class="summary-row">
                    <span class="kicker">type</span>
                    <span class="type-pill">{{ proseType }}</span>
                </div>
                <label class="legacy-label" for="prose-confirm-blurb"
                    >give this piece (of shit) context, if ya want</label
                >
                <textarea
                    id="prose-confirm-blurb"
                    v-model="blurb"
                    class="legacy-textarea"
                    placeholder="a short blurb that gives readers context..."
                    rows="3"
                />
            </div>
        </div>
        <template #footer>
            <div class="actions">
                <BaseButton
                    variant="outline-secondary"
                    size="small"
                    title="continue editing"
                    :showTooltip="false"
                    @click="onClose"
                >
                    continue editing
                </BaseButton>
                <BaseButton
                    variant="success"
                    size="small"
                    :title="confirmLabel"
                    :showTooltip="false"
                    :disabled="confirming"
                    @click="onConfirm"
                >
                    {{ confirming ? "..." : confirmLabel }}
                </BaseButton>
            </div>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { renderMarkdownToSafeHtml } from "@/utils/markdownUtilsV3";

const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        proseTitle: string;
        proseType: string;
        proseContext?: string;
        proseMarkdown?: string;
        previewMode?: boolean;
        initialBlurb?: string;
        isEdit?: boolean;
    }>(),
    {
        proseContext: "",
        proseMarkdown: "",
        previewMode: false,
        initialBlurb: "",
        isEdit: false,
    }
);

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    close: [];
    confirm: [blurb: string];
}>();

const confirming = ref(false);
const blurb = ref(props.initialBlurb);
const isPreviewMode = computed(() => props.previewMode);

const modalTitle = computed(() =>
    props.isEdit ? "save prose update?" : "publish prose?"
);

const confirmLabel = computed(() => (props.isEdit ? "save" : "publish"));
const previewContext = computed(() =>
    (props.proseContext || props.initialBlurb || "").trim()
);
const renderedPreviewMarkdown = computed(() =>
    renderMarkdownToSafeHtml(props.proseMarkdown || "")
);

watch(
    () => props.modelValue,
    (open) => {
        if (open && !isPreviewMode.value) {
            blurb.value = props.initialBlurb;
        }
    }
);

function onClose() {
    emit("update:modelValue", false);
    emit("close");
}

function onConfirm() {
    confirming.value = true;
    emit(
        "confirm",
        isPreviewMode.value ? previewContext.value : blurb.value.trim()
    );
    emit("update:modelValue", false);
    emit("close");
    confirming.value = false;
}
</script>

<style scoped>
.preview-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
}

.preview-header {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}

.kicker {
    margin: 0;
    font-size: 0.78rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--accent-green);
    opacity: 0.9;
}

.subcopy {
    margin: 0;
    font-size: 0.92rem;
    opacity: 0.75;
}

.preview-surface {
    border: 1px solid color-mix(in srgb, var(--accent-green) 45%, transparent);
    border-radius: 0.75rem;
    padding: 0.9rem;
    max-height: min(68vh, 760px);
    overflow: auto;
    background: color-mix(in srgb, var(--accent-blue) 10%, transparent);
}

.legacy-surface {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
}

.summary-row {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.preview-title {
    margin: 0;
    color: var(--accent-fuschia);
    font-size: 1rem;
}

.title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.65rem;
    flex-wrap: wrap;
}

.type-pill {
    display: inline-flex;
    width: fit-content;
    border: 1px solid var(--accent-lavender);
    border-radius: 999px;
    padding: 0.1rem 0.55rem;
    text-transform: lowercase;
    color: var(--accent-lavender);
    font-size: 0.83rem;
}

.preview-excerpt {
    margin: 0.7rem 0 0;
    color: var(--main-text);
    opacity: 0.82;
    font-style: italic;
    border-left: 3px solid var(--accent-blue);
    padding-left: 0.6rem;
}

.preview-markdown {
    margin-top: 0.85rem;
    line-height: 1.55;
    color: var(--main-text);
}

.preview-markdown :deep(p) {
    margin: 0;
    white-space: pre-wrap;
}

.preview-markdown :deep(a) {
    color: var(--accent-fuschia);
    text-decoration: underline;
}

.legacy-label {
    font-size: 0.9rem;
    color: var(--accent-blue);
}

.legacy-textarea {
    width: 100%;
    min-height: 4rem;
    padding: 0.6rem 0.7rem;
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.4;
    color: var(--main-text);
    background: var(--input-bg, rgba(255, 255, 255, 0.06));
    border: 1px solid color-mix(in srgb, var(--accent-green) 40%, transparent);
    border-radius: 0.5rem;
    resize: vertical;
}

.legacy-textarea:focus {
    outline: none;
    border-color: var(--accent-green);
}

@media (min-width: 768px) {
    .preview-title {
        font-size: 1.25rem;
    }
    .preview-surface {
        padding: 1rem 1.1rem;
    }
}

.actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
}
</style>
