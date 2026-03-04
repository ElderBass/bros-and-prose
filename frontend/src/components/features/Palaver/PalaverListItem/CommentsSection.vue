<template>
    <section class="comments-section">
        <p v-if="!comments.length" class="empty-copy">
            no comments yet — be the first to join the palaver.
        </p>
        <div v-else class="comments-list">
            <CommentItem
                v-for="comment in comments"
                :key="comment.id"
                :entryId="entry.id"
                :comment="comment"
                :size="commentSize"
                :variant="variant"
                @reply="handleReply"
            />
        </div>
    </section>
    <AddCommentModal
        v-if="showReplyModal"
        :open="showReplyModal"
        :isItemComment="true"
        :replyTo="replyContext"
        @submit="submitReply"
        @close="closeReplyModal"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { PalaverEntry } from "@/types/palaver";
import type { Comment } from "@/types";
import CommentItem from "@/components/features/common/CommentItem/index.vue";
import AddCommentModal from "@/components/modal/AddCommentModal.vue";
import { usePalaver } from "@/composables/usePalaver";
import { useUIStore } from "@/stores/ui";
import { ADDED_COMMENT_SUCCESS_ALERT, QUICK_ERROR } from "@/constants";
import { useLog } from "@/composables";

const props = withDefaults(
    defineProps<{
        entry: PalaverEntry;
        variant?: "lavender" | "fuschia" | "blue" | "green" | "red";
        commentSize?: "default" | "compact";
    }>(),
    {
        variant: "lavender",
        commentSize: "compact",
    }
);

const comments = computed<Comment[]>(() => props.entry.comments || []);

const showReplyModal = ref(false);
const replyContext = ref<
    { commentId: string; username: string; text: string } | undefined
>();

const handleReply = (comment: Comment) => {
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
    try {
        // The usePalaver composable will handle building the correct metadata
        await usePalaver().addComment(props.entry, reply);
        closeReplyModal();
        useUIStore().showAlert(ADDED_COMMENT_SUCCESS_ALERT);
    } catch (error) {
        console.error("Error submitting reply:", error);
        await useLog().error(`Error submitting reply: ${error}`);
        useUIStore().showAlert(
            QUICK_ERROR([
                "failed to submit reply",
                (error as Error).message || "unknown error",
            ])
        );
    }
};
</script>

<style scoped>
.comments-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem 0;
}

.empty-copy {
    margin: 0;
    opacity: 0.65;
    font-size: 0.9rem;
    font-style: italic;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}
</style>
