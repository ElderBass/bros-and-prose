<template>
    <div class="inbrospection-section">
        <PageTitle title="inbrospection..." />

        <div v-if="comments.length" class="comments-list">
            <div v-for="c in orderedComments" :key="c.id" class="comment-item">
                <div class="avatar">
                    <AvatarImage
                        :icon="iconFor(c.user.avatar)"
                        :size="isMobile ? 'small' : 'medium'"
                    />
                </div>
                <div class="content">
                    <div class="meta">
                        <span class="username">@{{ c.user.username }}</span>
                        <span class="dot">•</span>
                        <span class="timestamp">{{
                            formatDate(c.createdAt)
                        }}</span>
                    </div>
                    <p class="text">{{ c.comment }}</p>
                </div>
            </div>
        </div>

        <div v-else class="no-comments">
            <p>no inbrospection yet — be the first to drop a thought</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import type { Book, Comment } from "@/types";
import { AVATAR_ICON_LIST } from "@/constants";
import { storeToRefs } from "pinia";
import { useUIStore } from "@/stores/ui";

const props = defineProps<{
    book: Book;
}>();

const { isMobile } = storeToRefs(useUIStore());

const comments = computed(() => {
    return Object.values(props.book?.discussionComments ?? {}) as Comment[];
});

const orderedComments = comments.value
    .slice()
    .sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

const iconFor = (iconName: string) => {
    return (
        AVATAR_ICON_LIST.find((i) => i.iconName === iconName) ??
        AVATAR_ICON_LIST.find((i) => i.iconName === "user-astronaut")!
    );
};

const formatDate = (iso: string) => {
    try {
        const d = new Date(iso);
        return d.toLocaleString(undefined, {
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
</script>

<style scoped>
.inbrospection-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
    width: 100%;
    border: 2px solid var(--accent-fuschia);
    border-radius: 1rem;
    padding: 1rem;
    background: linear-gradient(
        180deg,
        rgba(255, 77, 255, 0.06),
        rgba(255, 77, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(255, 77, 255, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

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

.no-comments {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    padding: 2rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 1rem;
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.no-comments p {
    margin: 0;
    font-style: italic;
    opacity: 0.85;
}

@media (max-width: 768px) {
    .comment-item {
        padding: 0.75rem;
    }
}
</style>
