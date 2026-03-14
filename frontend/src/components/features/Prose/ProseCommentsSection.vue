<template>
    <section class="comments-section">
        <p class="section-title">feedback</p>

        <p v-if="!comments.length" class="empty-copy">
            no feedback yet - be first to drop a thought.
        </p>

        <div v-else class="comments-list">
            <ProseCommentItem
                v-for="comment in comments"
                :key="comment.id"
                :entry="entry"
                :comment="comment"
                @reply="openReplyModal"
            />
        </div>
    </section>

    <AddCommentModal
        v-if="showReplyModal"
        :open="showReplyModal"
        :isItemComment="true"
        :submitting="submittingReply"
        :replyTo="replyContext"
        @submit="submitReply"
        @close="closeReplyModal"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Comment, ProseEntry } from "@/types";
import { useProse } from "@/composables/useProse";
import { useUIStore } from "@/stores/ui";
import { ADDED_COMMENT_SUCCESS_ALERT, QUICK_ERROR } from "@/constants";
import { useLog } from "@/composables";
import AddCommentModal from "@/components/modal/AddCommentModal.vue";
import ProseCommentItem from "./ProseCommentItem.vue";

const props = defineProps<{
    entry: ProseEntry;
}>();

const comments = computed<Comment[]>(() => props.entry.comments || []);
const { addComment } = useProse();
const { showAlert } = useUIStore();

const showReplyModal = ref(false);
const submittingReply = ref(false);
const replyContext = ref<
    { commentId: string; username: string; text: string } | undefined
>();

const openReplyModal = (comment: Comment) => {
    replyContext.value = {
        commentId: comment.id,
        username: comment.userInfo.username,
        text: comment.text,
    };
    showReplyModal.value = true;
};

const closeReplyModal = () => {
    showReplyModal.value = false;
    replyContext.value = undefined;
};

const submitReply = async (reply: Comment) => {
    submittingReply.value = true;
    try {
        await addComment(props.entry, reply);
        closeReplyModal();
        showAlert(ADDED_COMMENT_SUCCESS_ALERT);
    } catch (error) {
        console.error("Error submitting prose reply:", error);
        await useLog().error(`Error submitting prose reply: ${error}`);
        showAlert(
            QUICK_ERROR([
                "failed to submit reply",
                (error as Error).message || "unknown error",
            ])
        );
    } finally {
        submittingReply.value = false;
    }
};
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
</style>
