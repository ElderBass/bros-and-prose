<template>
    <div class="comment-item">
        <div class="avatar">
            <AvatarImage
                :icon="iconFor(comment.user.avatar)"
                :size="mobile ? 'small' : 'medium'"
            />
        </div>
        <div class="content">
            <div class="meta">
                <span class="username">@{{ comment.user.username }}</span>
                <span class="dot">•</span>
                <span class="timestamp">{{
                    formatDateForDevice(comment.createdAt)
                }}</span>
            </div>
            <p class="text">{{ comment.comment }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { Comment } from "@/types";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import { AVATAR_ICON_LIST } from "@/constants";

const { mobile } = useDisplay();

defineProps<{
    comment: Comment;
}>();
const iconFor = (iconName: string) => {
    return (
        AVATAR_ICON_LIST.find((i) => i.iconName === iconName) ??
        AVATAR_ICON_LIST.find((i) => i.iconName === "user-astronaut")!
    );
};

// Mobile-aware date formatter: shorter on mobile, fuller on desktop
const formatDateForDevice = computed(() => {
    return (iso: string) => {
        try {
            const d = new Date(iso);
            return mobile.value
                ? d.toLocaleString(undefined, {
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
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
</script>

<style scoped>
.comment-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid var(--accent-lavender);
    border-radius: 1rem;
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
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

.meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--main-text);
    opacity: 0.85;
}

.username {
    color: var(--accent-fuschia);
    font-size: 1.25rem;
    font-weight: 600;
}

.dot {
    opacity: 0.6;
}

.timestamp {
    font-size: 0.9rem;
}

.text {
    margin: 0;
    line-height: 1.6;
}

@media (max-width: 768px) {
    .comment-item {
        padding: 0.75rem;
    }
}
</style>
