<template>
    <BaseModal
        :modelValue="modelValue"
        :title="modalTitle"
        size="medium"
        shadow-color="green"
        @update:modelValue="$emit('update:modelValue', $event)"
        @close="onClose"
    >
        <div class="content">
            <div class="summary">
                <p class="summary-row">
                    <span class="label">title</span>
                    <span class="value prose-title">{{ proseTitle }}</span>
                </p>
                <p class="summary-row">
                    <span class="label">type</span>
                    <span class="value type-pill">{{ proseType }}</span>
                </p>
            </div>
            <div class="blurb-field">
                <label class="blurb-label" for="prose-confirm-blurb"
                    >give this piece (of shit) context, if ya want</label
                >
                <textarea
                    id="prose-confirm-blurb"
                    v-model="blurb"
                    class="blurb-textarea"
                    placeholder="a short blurb that gives readers context..."
                    rows="3"
                    aria-label="blurb / context for this piece"
                />
            </div>
        </div>
        <template #footer>
            <div class="actions">
                <BaseButton
                    variant="outline"
                    size="small"
                    title="cancel"
                    :showTooltip="false"
                    @click="onClose"
                >
                    cancel
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

const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        proseTitle: string;
        proseType: string;
        initialBlurb?: string;
        isEdit?: boolean;
    }>(),
    {
        initialBlurb: "",
        isEdit: false,
    }
);

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    close: [];
    confirm: [blurb: string];
}>();

const blurb = ref(props.initialBlurb);
const confirming = ref(false);

watch(
    () => props.modelValue,
    (open) => {
        if (open) {
            blurb.value = props.initialBlurb;
        }
    }
);

watch(
    () => props.initialBlurb,
    (val) => {
        if (props.modelValue) blurb.value = val;
    }
);

const modalTitle = computed(() =>
    props.isEdit ? "save changes?" : "ready to publish?"
);

const confirmLabel = computed(() => (props.isEdit ? "save" : "publish"));

function onClose() {
    emit("update:modelValue", false);
    emit("close");
}

function onConfirm() {
    confirming.value = true;
    emit("confirm", blurb.value.trim());
    emit("update:modelValue", false);
    emit("close");
    confirming.value = false;
}
</script>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 1rem;
}

.summary {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.summary-row {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.label {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--accent-green);
    opacity: 0.9;
}

.blurb-label {
    padding-left: 0.35rem;
    font-size: 0.8rem;
    letter-spacing: 0.06em;
    color: var(--accent-green);
    opacity: 0.9;
}

.value {
    font-size: 1.05rem;
}

.prose-title {
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    font-style: italic;
    font-weight: 600;
}

.type-pill {
    text-transform: lowercase;
    color: var(--accent-lavender);
}

.blurb-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.blurb-field label {
    font-size: 0.9rem;
    color: var(--accent-blue);
}

.blurb-textarea {
    width: 100%;
    min-height: 4rem;
    padding: 0.5rem 0.6rem;
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.4;
    color: var(--main-text);
    background: var(--input-bg, rgba(255, 255, 255, 0.06));
    border: 1px solid color-mix(in srgb, var(--accent-green) 40%, transparent);
    border-radius: 0.5rem;
    resize: vertical;
}

@media (min-width: 768px) {
    .label {
        font-size: 0.95rem;
    }

    .blurb-label {
        font-size: 0.95rem;
    }

    .value {
        font-size: 1.25rem;
    }

    .blurb-field label {
        font-size: 1.05rem;
    }

    .blurb-textarea {
        font-size: 1.1rem;
        padding: 0.6rem 0.75rem;
        min-height: 4.5rem;
    }
}

.blurb-textarea::placeholder {
    opacity: 0.6;
}

.blurb-textarea:focus {
    outline: none;
    border-color: var(--accent-green);
}

.actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
}
</style>
