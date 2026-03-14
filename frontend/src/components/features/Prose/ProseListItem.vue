<template>
    <RouterLink :to="`/prose/${entry.id}`" class="prose-link">
        <BaseCard
            :shadow-color="typeColor"
            size="medium"
            :hoverable="true"
            class="prose-card"
        >
            <div class="prose-header">
                <span class="type-pill">{{ entry.type }}</span>
                <span class="created-at">{{ createdAtLabel }}</span>
            </div>

            <h3 class="prose-title">{{ entry.title }}</h3>

            <div class="author-row">
                <AvatarImage
                    :avatar="entry.userInfo.avatar"
                    :avatarType="entry.userInfo.avatarType || 'icon'"
                    size="xsmall"
                />
                <span class="author">@{{ entry.userInfo.username }}</span>
            </div>

            <ExpandableText :text="previewText" :truncateLength="220" />

            <div class="meta-row">
                <span>{{ entry.comments?.length || 0 }} comments</span>
                <span>{{ entry.likes?.length || 0 }} likes</span>
                <span>{{ entry.dislikes?.length || 0 }} dislikes</span>
            </div>
        </BaseCard>
    </RouterLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import BaseCard from "@/components/ui/BaseCard.vue";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import ExpandableText from "@/components/features/common/ExpandableText.vue";
import type { ProseEntry } from "@/types";
import { getPlainTextFromMarkdown } from "@/utils";

const props = defineProps<{
    entry: ProseEntry;
}>();

const createdAtLabel = computed(() => {
    const date = new Date(props.entry.createdAt);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
});

const typeColor = computed(() => {
    switch (props.entry.type) {
        case "creative":
            return "fuschia";
        case "academic":
            return "blue";
        case "poetic":
            return "lavender";
        case "misc":
        default:
            return "green";
    }
});

const previewText = computed(() => {
    const rawText = props.entry.excerpt || props.entry.markdown || "";
    return getPlainTextFromMarkdown(rawText);
});
</script>

<style scoped>
.prose-link {
    text-decoration: none;
    color: inherit;
    display: block;
    width: 100%;
}

.prose-card {
    width: 100%;
}

.prose-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
}

.type-pill {
    text-transform: lowercase;
    border: 1px solid var(--accent-fuschia);
    color: var(--accent-fuschia);
    padding: 0.125rem 0.65rem;
    border-radius: 999px;
    font-size: 0.875rem;
    letter-spacing: 0.02em;
}

.created-at {
    color: var(--main-text);
    opacity: 0.8;
    font-size: 0.95rem;
}

.prose-title {
    margin: 0;
    color: var(--accent-blue);
    font-size: 1.45rem;
    line-height: 1.35;
}

.author-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.author {
    color: var(--accent-lavender);
    font-size: 1rem;
}

.meta-row {
    display: flex;
    gap: 1rem;
    color: var(--main-text);
    opacity: 0.8;
    font-size: 0.95rem;
}

@media (max-width: 768px) {
    .prose-title {
        font-size: 1.25rem;
    }

    .meta-row {
        gap: 0.65rem;
        font-size: 0.85rem;
    }
}
</style>
