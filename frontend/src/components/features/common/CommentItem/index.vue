<template>
    <div class="comment-item" :class="[`variant-${variant}`, `size-${size}`]">
        <div class="avatar">
            <AvatarImage
                :avatar="comment.userInfo.avatar"
                :avatarType="comment.userInfo.avatarType || 'icon'"
                :size="avatarSize"
            />
        </div>
        <div class="content">
            <div class="header">
                <div class="meta">
                    <UsernameLink
                        :username="comment.userInfo.username"
                        fontSize="small"
                    />
                    <span class="dot">•</span>
                    <span class="timestamp">{{
                        formatDateForDevice(comment.createdAt)
                    }}</span>
                </div>
                <div class="actions">
                    <ReactionActions
                        v-if="showReactionActions"
                        :comment="comment"
                        :entryId="entryId"
                    />
                    <ReplyButton
                        v-if="showReplyButton"
                        :size="replyButtonSize"
                        @reply="$emit('reply', comment)"
                    />
                </div>
            </div>
            <div v-if="comment.replyToUsername" class="reply-wrapper">
                <div class="reply-indicator">
                    <FontAwesomeIcon :icon="faReply" class="reply-icon" />
                    <span class="reply-text">
                        sniping back at
                        <UsernameLink
                            :username="comment.replyToUsername"
                            fontSize="small"
                        />
                    </span>
                </div>
                <p v-if="comment.replyToText" class="replied-text">
                    "{{ truncatedReplyText }}"
                </p>
            </div>
            <p class="text">{{ comment.text }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import type { Comment } from "@/types";
import ReactionActions from "./ReactionActions.vue";
import ReplyButton from "./ReplyButton.vue";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import UsernameLink from "@/components/ui/UsernameLink.vue";
import { isGuestUser } from "@/utils";
import { useUserStore } from "@/stores/user";

defineOptions({ name: "CommentItem" });

const props = withDefaults(
    defineProps<{
        comment: Comment;
        entryId: string;
        size?: "default" | "compact";
        variant?: "lavender" | "fuschia" | "blue" | "green" | "red";
    }>(),
    {
        size: "default",
        variant: "lavender",
    }
);

defineEmits<{
    (e: "reply", comment: Comment): void;
}>();

const { mobile } = useDisplay();

const avatarSize = computed(() => {
    if (props.size === "compact") {
        return mobile.value ? "xsmall" : "small";
    }
    return mobile.value ? "small" : "medium";
});

const replyButtonSize = computed(() => {
    if (props.size === "compact") {
        return "supersmall";
    }
    return mobile.value ? "supersmall" : "xsmall";
});

// Mobile-aware date formatter: shorter on mobile, fuller on desktop
const formatDateForDevice = computed(() => {
    return (iso: string) => {
        try {
            const d = new Date(iso);
            const useCompactFormat =
                mobile.value === true || props.size === "compact";
            return useCompactFormat
                ? d.toLocaleString(undefined, {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                  })
                : d.toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                  });
        } catch {
            return iso;
        }
    };
});

const showReactionActions = computed(() => {
    return (
        !isGuestUser() &&
        props.comment.userInfo.id !== useUserStore().loggedInUser.id
    );
});

const showReplyButton = computed(() => {
    return (
        !isGuestUser() &&
        props.comment.userInfo.id !== useUserStore().loggedInUser.id
    );
});

const truncatedReplyText = computed(() => {
    if (!props.comment.replyToText) return "";
    return props.comment.replyToText.length > 50
        ? props.comment.replyToText.substring(0, 50) + "..."
        : props.comment.replyToText;
});
</script>

<style scoped>
.comment-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-radius: 1rem;
    border: 2px solid var(--accent-lavender);
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.comment-item.variant-fuschia {
    border-color: var(--accent-fuschia);
}
.comment-item.variant-blue {
    border-color: var(--accent-blue);
}
.comment-item.variant-green {
    border-color: var(--accent-green);
}

.comment-item.size-compact {
    padding: 0.5rem 0.75rem;
    gap: 0.75rem;
    border-width: 1px;
}

.avatar {
    flex-shrink: 0;
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.meta {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--main-text);
    opacity: 0.85;
    font-size: 0.9rem;
}

.comment-item.size-compact .meta {
    font-size: 0.8rem;
}

.comment-item.size-compact .username {
    font-size: 0.9rem;
}

.dot {
    opacity: 0.6;
}

.timestamp {
    font-size: 0.85rem;
}

.comment-item.size-compact .timestamp {
    font-size: 0.75rem;
}

.reply-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: color-mix(in srgb, var(--accent-lavender) 10%, transparent);
    border-left: 3px solid var(--accent-lavender);
    border-radius: 0.25rem;
    font-size: 0.85rem;
    opacity: 0.9;
}

.reply-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.reply-icon {
    color: var(--accent-lavender);
    font-size: 0.8rem;
}

.reply-text {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.replied-text {
    font-size: 0.9rem;
    font-style: italic;
    opacity: 0.7;
    /* border-left: 1px solid var(--accent-lavender); */
    padding-left: 0.75rem;
}

.text {
    margin: 0;
    line-height: 1.5;
    font-size: 1rem;
}

.comment-item.size-compact .text {
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .comment-item.size-compact {
        padding: 0.5rem;
        padding-top: 0.75rem;
    }
}
</style>
