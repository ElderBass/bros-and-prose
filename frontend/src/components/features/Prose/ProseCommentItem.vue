<template>
    <div class="comment-item">
        <AvatarImage
            :avatar="comment.userInfo.avatar"
            :avatarType="comment.userInfo.avatarType || 'icon'"
            :size="mobile ? 'xsmall' : 'small'"
        />
        <div class="comment-content">
            <div class="comment-header">
                <div class="meta">
                    <UsernameLink
                        :username="comment.userInfo.username"
                        fontSize="small"
                    />
                    <span class="dot">•</span>
                    <span class="timestamp">{{ timestamp }}</span>
                </div>
                <div class="actions">
                    <ProseCommentReactionActions
                        v-if="showActions"
                        :entry="entry"
                        :comment="comment"
                        @entry-updated="$emit('entry-updated', $event)"
                    />
                    <ReplyButton
                        v-if="showActions"
                        size="supersmall"
                        @reply="$emit('reply', comment)"
                    />
                </div>
            </div>

            <div v-if="comment.replyToUsername" class="reply-context">
                <span>replying to @{{ comment.replyToUsername }}</span>
                <p v-if="comment.replyToText">"{{ truncatedReplyText }}"</p>
            </div>

            <MentionText :text="comment.text" fontSize="small" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import UsernameLink from "@/components/ui/UsernameLink.vue";
import MentionText from "@/components/ui/MentionText.vue";
import ReplyButton from "@/components/features/common/CommentItem/ReplyButton.vue";
import ProseCommentReactionActions from "./ProseCommentReactionActions.vue";
import type { Comment, ProseEntry } from "@/types";
import { useUserStore } from "@/stores/user";
import { isGuestUser } from "@/utils";

const props = defineProps<{
    entry: ProseEntry;
    comment: Comment;
}>();

defineEmits<{
    (e: "reply", comment: Comment): void;
    (e: "entry-updated", entry: ProseEntry): void;
}>();

const { mobile } = useDisplay();

const showActions = computed(() => {
    return (
        !isGuestUser() &&
        props.comment.userInfo.id !== useUserStore().loggedInUser.id
    );
});

const timestamp = computed(() => {
    try {
        return new Date(props.comment.createdAt).toLocaleString(undefined, {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return props.comment.createdAt;
    }
});

const truncatedReplyText = computed(() => {
    if (!props.comment.replyToText) return "";
    return props.comment.replyToText.length > 100
        ? props.comment.replyToText.slice(0, 100) + "..."
        : props.comment.replyToText;
});
</script>

<style scoped>
.comment-item {
    display: flex;
    gap: 0.75rem;
    border: 1px solid rgba(179, 136, 255, 0.5);
    background: rgba(179, 136, 255, 0.08);
    border-radius: 0.85rem;
    padding: 0.75rem;
}

.comment-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.comment-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.meta {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

.dot {
    opacity: 0.7;
}

.timestamp {
    font-size: 0.8rem;
    opacity: 0.8;
}

.actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.reply-context {
    font-size: 0.85rem;
    opacity: 0.9;
    border-left: 2px solid var(--accent-lavender);
    padding-left: 0.5rem;
}

.reply-context p {
    margin: 0.1rem 0 0;
    font-style: italic;
}

@media (max-width: 768px) {
    .comment-header {
        align-items: flex-start;
        flex-direction: column;
        gap: 0.2rem;
    }
}
</style>
