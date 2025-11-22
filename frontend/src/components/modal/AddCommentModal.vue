<template>
    <BaseModal
        :modelValue="open"
        @close="onClose"
        title="add a comment"
        size="medium"
    >
        <form class="add-comment-form" @submit.prevent="submit">
            <div class="field">
                <label for="comment-input">your inbrospection</label>
                <textarea
                    id="comment-input"
                    v-model="localComment"
                    class="comment-textarea"
                    :rows="isMobile ? 5 : 6"
                    placeholder="drop your wisdom..."
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
                    :size="isMobile ? 'small' : 'medium'"
                    :style="{ width: '100%' }"
                    >cancel</BaseButton
                >
                <BaseButton
                    variant="outline"
                    type="submit"
                    :disabled="!canSubmit"
                    :size="isMobile ? 'small' : 'medium'"
                    :style="{ width: '100%' }"
                    >submit</BaseButton
                >
            </div>
        </form>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";
import { v4 as uuid } from "uuid";
import type { User, Comment } from "@/types";
import { useUserStore } from "@/stores/user";

const emit = defineEmits<{
    (e: "close"): void;
    (e: "submit", value: Comment): void;
}>();

const props = defineProps<{
    open: boolean;
}>();

const { loggedInUser } = storeToRefs(useUserStore());
const { isMobile } = storeToRefs(useUIStore());

const localComment = ref("");
const maxLength = 500;

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) localComment.value = "";
    }
);

const isValid = computed(() => {
    const text = localComment.value.trim();
    return text.length >= 3 && text.length <= maxLength;
});

const validationMessage = computed(() => {
    const text = localComment.value.trim();
    if (text.length === 0) return "comment is required";
    if (text.length < 3) return "minimum 3 characters";
    if (text.length > maxLength) return `maximum ${maxLength} characters`;
    return "";
});

const canSubmit = computed(() => isValid.value);

const submit = () => {
    if (!canSubmit.value) return;
    const payload = localComment.value.trim() as string;
    const fullComment = {
        id: uuid(),
        user: loggedInUser.value as User,
        comment: payload,
        createdAt: new Date().toISOString(),
    };
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
