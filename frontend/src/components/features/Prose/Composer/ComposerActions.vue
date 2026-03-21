<template>
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
                @click="emit('cancel')"
            >
                cancel
            </BaseButton>
            <BaseButton
                variant="success"
                size="small"
                :title="primaryTitle"
                :showTooltip="false"
                :disabled="submitDisabled || submitting"
                @click="emit('submit')"
            >
                {{ primaryLabel }}
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";

defineOptions({ name: "ComposerActions" });

const props = defineProps<{
    validationMessage: string;
    draftRestored: boolean;
    wordCount: number;
    charCount: number;
    submitDisabled: boolean;
    submitting: boolean;
    isEdit: boolean;
}>();

const emit = defineEmits<{
    cancel: [];
    submit: [];
}>();

const primaryTitle = computed(() =>
    props.submitDisabled
        ? "fill out required fields"
        : props.isEdit
          ? "save changes"
          : "publish prose"
);

const primaryLabel = computed(() =>
    props.submitting
        ? props.isEdit
            ? "saving…"
            : "publishing…"
        : props.isEdit
          ? "save"
          : "publish"
);
</script>

<style scoped>
.meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
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

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.65rem;
}
</style>
