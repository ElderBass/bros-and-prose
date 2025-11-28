<template>
    <BaseModal
        :modelValue="open"
        @close="onClose"
        :title="modalTitle"
        size="medium"
    >
        <div v-if="submitting" class="loading-content">
            <LoadingSpinnerContainer
                :size="mobile ? 'medium' : 'large'"
                :message="loadingMessage"
            />
        </div>
        <form v-else class="add-comment-form" @submit.prevent="submit">
            <div class="field">
                <label for="comment-input">{{ labelText }}</label>
                <textarea
                    id="comment-input"
                    v-model="localComment"
                    class="comment-textarea"
                    :rows="mobile ? 5 : 6"
                    :placeholder="textareaPlaceholder"
                ></textarea>
                <div class="meta-row">
                    <p class="hint" v-if="validationMessage">
                        {{ validationMessage }}
                    </p>
                    <span class="char-count"
                        >{{ localComment.length }}/{{ maxLength }}</span
                    >
                </div>
            </div>

            <div class="actions">
                <BaseButton
                    variant="outline-secondary"
                    @click="onClose"
                    :size="actionButtonSize"
                    :style="{ width: '100%' }"
                    >{{ primaryButtonLabel }}</BaseButton
                >
                <BaseButton
                    variant="outline"
                    type="submit"
                    :disabled="!canSubmitComment"
                    :size="actionButtonSize"
                    :style="{ width: '100%' }"
                    >{{ secondaryButtonLabel }}</BaseButton
                >
            </div>
        </form>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import type { Comment } from "@/types";
import { buildPalaverComment } from "@/utils";

const emit = defineEmits<{
    (e: "close"): void;
    (e: "submit", value: Comment): void;
}>();

const props = withDefaults(
    defineProps<{
        open: boolean;
        isProgressUpdate?: boolean;
        submitting?: boolean;
        isItemComment?: boolean;
    }>(),
    {
        isProgressUpdate: false,
        submitting: false,
        isItemComment: false,
    }
);

const { mobile } = useDisplay();

const localComment = ref("");

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) localComment.value = "";
    }
);

const loadingMessage = computed(() =>
    props.isProgressUpdate ? "updating progress..." : "adding comment..."
);

const labelText = computed(() => {
    if (props.isItemComment) {
        return "join the palaver";
    } else {
        return "your inbrospection";
    }
});

const maxLength = computed(() => (props.isItemComment ? 200 : 500));

const modalTitle = computed(() =>
    props.isProgressUpdate ? "hit'em with a supdate" : "add a comment"
);

const textareaPlaceholder = computed(() => {
    if (props.isProgressUpdate) {
        return "(comment optional, but sexy)";
    } else if (props.isItemComment) {
        return "holla atcha boy";
    } else {
        return "regale us with erudite insight";
    }
});

const validationMessage = computed(() => {
    const text = localComment.value.trim();
    if (text.length < 3) return "minimum 3 characters";
    if (text.length > maxLength.value)
        return `maximum ${maxLength.value} characters`;
    return "";
});

const canSubmitComment = computed(() => {
    const text = localComment.value.trim();
    return text.length >= 3 && text.length <= maxLength.value;
});

const primaryButtonLabel = computed(() =>
    props.isProgressUpdate ? "naw I'm good" : "cancel"
);

const secondaryButtonLabel = computed(() =>
    props.isProgressUpdate ? "send it" : "submit"
);

const actionButtonSize = computed(() => (mobile ? "small" : "medium"));

const submit = () => {
    if (!canSubmitComment.value) return;
    const payload = localComment.value.trim() as string;
    const fullComment = buildPalaverComment(payload);
    emit("submit", fullComment);
};
const onClose = () => emit("close");
</script>

<style scoped>
.add-comment-form {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.5rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    padding-left: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--accent-lavender);
}

.comment-textarea {
    width: 100%;
    resize: vertical;
    background-color: var(--background-color);
    color: var(--main-text);
    border: 2px solid var(--accent-blue);
    border-radius: 0.5rem;
    font-family: "Crimson Text", serif;
    font-size: 1.125rem;
    padding: 0.75rem 1rem;
}

.comment-textarea:focus {
    outline: none;
    border-color: var(--accent-lavender);
}

.meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.hint {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.75;
}

.char-count {
    font-size: 0.85rem;
    opacity: 0.7;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 0.5rem;
}

@media (max-width: 768px) {
    label {
        font-size: 1.1rem;
    }
    .add-comment-form {
        padding: 0.25rem;
    }
}
</style>
