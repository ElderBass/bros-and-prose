<template>
    <section class="comments-section">
        <p class="section-title">feedback</p>

        <p v-if="!comments.length" class="empty-copy">
            no feedback yet - be the first to tell bro he's trash.
        </p>

        <div v-else class="comments-list">
            <ProseCommentItem
                v-for="comment in comments"
                :key="comment.id"
                :entry="entry"
                :comment="comment"
                @reply="onReply"
                @entry-updated="(e) => emit('entry-updated', e)"
            />
        </div>

        <div
            v-if="!isGuestUser()"
            ref="composerAnchorRef"
            class="inline-composer"
        >
            <div v-if="composerExpanded && submitting" class="loading-wrap">
                <LoadingSpinnerContainer
                    :size="mobile ? 'medium' : 'large'"
                    message="adding comment..."
                />
            </div>
            <form
                v-else-if="composerExpanded"
                class="composer-form"
                @submit.prevent="submit"
            >
                <div v-if="replyContext" class="reply-context">
                    <div class="reply-header">
                        <FontAwesomeIcon :icon="faReply" class="reply-icon" />
                        <span>replying to @{{ replyContext.username }}</span>
                    </div>
                    <p class="reply-preview">"{{ truncatedReplyText }}"</p>
                </div>
                <div class="field">
                    <label for="prose-inline-comment-input">{{
                        labelText
                    }}</label>
                    <MentionTextArea
                        v-model="localComment"
                        id="prose-inline-comment-input"
                        :rows="mobile ? 5 : 6"
                        :placeholder="textareaPlaceholder"
                        :label="labelText"
                    />
                    <div class="meta-row">
                        <p v-if="validationMessage" class="hint">
                            {{ validationMessage }}
                        </p>
                        <span class="char-count">{{ charCountLabel }}</span>
                    </div>
                </div>
                <div class="actions">
                    <div class="actions-row-top">
                        <BaseButton
                            variant="outline-secondary"
                            type="button"
                            v-bind="actionButtonProps"
                            @click="onCancel"
                            >{{ cancelLabel }}</BaseButton
                        >
                        <BaseButton
                            variant="outline-error"
                            type="button"
                            v-bind="actionButtonProps"
                            @click="onClearDraft"
                            >clear</BaseButton
                        >
                    </div>
                    <BaseButton
                        variant="outline"
                        type="submit"
                        :disabled="!canSubmitComment || submitting"
                        class="submit-button"
                        v-bind="actionButtonProps"
                        >submit</BaseButton
                    >
                </div>
            </form>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import type { Comment, ProseEntry } from "@/types";
import { useProse } from "@/composables/useProse";
import { useUIStore } from "@/stores/ui";
import { useUserStore } from "@/stores/user";
import { ADDED_COMMENT_SUCCESS_ALERT, QUICK_ERROR } from "@/constants";
import { useLog } from "@/composables";
import {
    buildPalaverComment,
    clearProseCommentDraft,
    getProseCommentDraft,
    isGuestUser,
    setProseCommentDraft,
} from "@/utils";
import MentionTextArea from "@/components/form/MentionTextArea.vue";
import LoadingSpinnerContainer from "@/components/ui/LoadingSpinnerContainer.vue";
import ProseCommentItem from "./ProseCommentItem.vue";

const INLINE_COMMENT_INPUT_ID = "prose-inline-comment-input";

const props = defineProps<{
    entry: ProseEntry;
}>();
const emit = defineEmits<{
    "entry-updated": [entry: ProseEntry];
}>();

const { addComment } = useProse();
const { showAlert } = useUIStore();
const { mobile } = useDisplay();
const { loggedInUser } = storeToRefs(useUserStore());

const composerAnchorRef = ref<HTMLElement | null>(null);

const comments = computed(() => props.entry.comments || []);
const composerExpanded = ref(false);
const submitting = ref(false);
const localComment = ref("");
type ReplyContext = { commentId: string; username: string; text: string };
const replyContext = ref<ReplyContext | undefined>();
const currentUserId = computed(() => loggedInUser.value?.id);

const maxLength = 50000;
let draftSaveTimeout: ReturnType<typeof setTimeout> | null = null;

function clearPersistedDraft(entryId = props.entry.id) {
    if (!entryId || !currentUserId.value) return;
    clearProseCommentDraft(entryId, currentUserId.value);
}

function persistDraft() {
    if (!props.entry.id || !currentUserId.value) return;
    const hasDraft =
        localComment.value.trim().length > 0 || !!replyContext.value;
    if (!hasDraft) {
        clearPersistedDraft();
        return;
    }
    setProseCommentDraft(props.entry.id, currentUserId.value, {
        text: localComment.value,
        replyContext: replyContext.value,
        savedAt: new Date().toISOString(),
    });
}

function restorePersistedDraft() {
    if (!props.entry.id || !currentUserId.value) return;
    const draft = getProseCommentDraft(props.entry.id, currentUserId.value);
    if (!draft) return;
    localComment.value = draft.text ?? "";
    if (draft.replyContext?.commentId) {
        const replyTargetExists = comments.value.some(
            (comment) => comment.id === draft.replyContext?.commentId
        );
        replyContext.value = replyTargetExists ? draft.replyContext : undefined;
        return;
    }
    replyContext.value = undefined;
}

watch(
    () => props.entry.id,
    (_newEntryId, oldEntryId) => {
        if (oldEntryId) clearPersistedDraft(oldEntryId);
        localComment.value = "";
        replyContext.value = undefined;
        composerExpanded.value = false;
    }
);

watch([localComment, replyContext, composerExpanded], () => {
    if (!composerExpanded.value || submitting.value) return;
    if (draftSaveTimeout) clearTimeout(draftSaveTimeout);
    draftSaveTimeout = setTimeout(() => {
        persistDraft();
        draftSaveTimeout = null;
    }, 350);
});

const labelText = computed(() =>
    replyContext.value ? "set that boy straight, my dude" : "join the palaver"
);

const textareaPlaceholder = computed(() =>
    replyContext.value ? "snipe back atcha boy" : "holla atcha boy"
);

const charCountLabel = computed(() => {
    const len = localComment.value.length;
    return `${len} characters`;
});

const validationMessage = computed(() => {
    const text = localComment.value.trim();
    if (text.length < 3) return "minimum 3 characters";
    if (text.length > maxLength) return `maximum ${maxLength} characters`;
    return "";
});

const canSubmitComment = computed(() => {
    const text = localComment.value.trim();
    return text.length >= 3 && text.length <= maxLength;
});

const truncatedReplyText = computed(() => {
    if (!replyContext.value?.text) return "";
    return replyContext.value.text.length > 80
        ? replyContext.value.text.substring(0, 80) + "..."
        : replyContext.value.text;
});

const cancelLabel = computed(() => "cancel");

const actionButtonProps = computed(() => ({
    size: mobile.value ? "small" : "medium",
    style: { width: "100%" },
}));

function focusTextarea() {
    const el = document.getElementById(
        INLINE_COMMENT_INPUT_ID
    ) as HTMLTextAreaElement | null;
    el?.focus();
}

function scrollComposerIntoView() {
    composerAnchorRef.value?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
    });
}

async function openComposer() {
    composerExpanded.value = true;
    restorePersistedDraft();
    await nextTick();
    scrollComposerIntoView();
    await nextTick();
    focusTextarea();
}

async function onReply(comment: Comment) {
    replyContext.value = {
        commentId: comment.id,
        username: comment.userInfo.username,
        text: comment.text,
    };
    await openComposer();
}

function onCancel() {
    if (replyContext.value) {
        replyContext.value = undefined;
        return;
    }
    composerExpanded.value = false;
    localComment.value = "";
    clearPersistedDraft();
}

function onClearDraft() {
    localComment.value = "";
    replyContext.value = undefined;
    clearPersistedDraft();
}

const submit = async () => {
    if (!canSubmitComment.value) return;
    submitting.value = true;
    try {
        const payload = localComment.value.trim();
        const fullComment = buildPalaverComment(
            payload,
            replyContext.value
                ? {
                      commentId: replyContext.value.commentId,
                      username: replyContext.value.username,
                      text: replyContext.value.text,
                  }
                : undefined
        );
        const updated = await addComment(props.entry, fullComment);
        if (updated) emit("entry-updated", updated);
        localComment.value = "";
        replyContext.value = undefined;
        clearPersistedDraft();
        showAlert(ADDED_COMMENT_SUCCESS_ALERT);
    } catch (error) {
        console.error("Error submitting prose comment:", error);
        await useLog().error(`Error submitting prose comment: ${error}`);
        showAlert(
            QUICK_ERROR([
                "failed to submit feedback",
                (error as Error).message || "unknown error",
            ])
        );
    } finally {
        submitting.value = false;
    }
};

onBeforeUnmount(() => {
    if (draftSaveTimeout) clearTimeout(draftSaveTimeout);
});

defineExpose({
    openComposer,
});
</script>

<style scoped>
.comments-section {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.section-title {
    margin: 0;
    color: var(--accent-lavender);
    font-size: 1.15rem;
}

.empty-copy {
    margin: 0;
    opacity: 0.7;
    font-style: italic;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.inline-composer {
    margin-top: 0.5rem;
}

.loading-wrap {
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.composer-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem 0 0;
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
    flex-direction: column;
    gap: 0.5rem;
}

.actions-row-top {
    display: flex;
    gap: 0.75rem;
}

.actions-row-top > * {
    flex: 1;
}

.submit-button {
    width: 100%;
}

.reply-context {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: color-mix(in srgb, var(--accent-lavender) 8%, transparent);
    border-left: 3px solid var(--accent-lavender);
    border-radius: 0.5rem;
}

.reply-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--accent-lavender);
}

.reply-icon {
    font-size: 0.9rem;
}

.reply-preview {
    margin: 0;
    font-size: 0.9rem;
    font-style: italic;
    opacity: 0.8;
    padding-left: 1.25rem;
}

@media (max-width: 768px) {
    label {
        font-size: 1.1rem;
    }
}
</style>
