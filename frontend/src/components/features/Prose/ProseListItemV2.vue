<template>
    <BaseCard
        :shadow-color="typeColor"
        :size="cardSize"
        :hoverable="true"
        class="prose-card"
        :class="{ 'prose-card--compact': compact }"
        :style="{ '--prose-type-color': `var(--accent-${typeColor})` }"
    >
        <div class="prose-header">
            <div class="author-row">
                <AvatarImage
                    :avatar="entry.userInfo.avatar"
                    :avatarType="entry.userInfo.avatarType || 'icon'"
                    size="xsmall"
                />
                <UsernameLink
                    :username="entry.userInfo.username"
                    :fontSize="mobile || compact ? 'small' : 'medium'"
                />
                <span v-if="createdAtLabel" class="created-at">
                    <span class="meta-dot" aria-hidden="true">·</span>
                    {{ createdAtLabel }}
                </span>
            </div>
            <ProseTypePill :type="entry.type" subtle />
        </div>

        <h3 class="prose-title">
            <RouterLink :to="`/prose/${entry.id}`" class="prose-title-link">
                {{ entry.title }}
            </RouterLink>
        </h3>

        <p v-if="blurb" class="prose-blurb">{{ blurb }}</p>

        <div class="footer-row">
            <ProseListItemStats :entry="entry" :compact="compact" />
            <span class="read-cue" aria-hidden="true">
                read
                <span class="read-arrow">&rarr;</span>
            </span>
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { RouterLink } from "vue-router";
import ProseTypePill from "./ProseTypePill.vue";
import ProseListItemStats from "./ProseListItemStats.vue";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import type { ProseEntry } from "@/types";
import { getProseTypeColor } from "@/utils";

const props = defineProps<{
    entry: ProseEntry;
    /** Smaller rendition used inside Favorites section. */
    compact?: boolean;
}>();

const { mobile } = useDisplay();

const createdAtLabel = computed(() => {
    const date = new Date(props.entry.createdAt);
    if (Number.isNaN(date.getTime())) return "";
    const isThisYear = date.getFullYear() === new Date().getFullYear();
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: isThisYear ? undefined : "numeric",
    });
});

const typeColor = computed(() => {
    return getProseTypeColor(props.entry.type) as
        | "green"
        | "lavender"
        | "pink"
        | "yellow"
        | "blue";
});

const blurb = computed(() => props.entry.excerpt?.trim() || "");

const cardSize = computed(() => {
    if (props.compact) return "small";
    return mobile.value ? "small" : "medium";
});
</script>

<style scoped>
.prose-card {
    width: 100%;
}

.prose-card :deep(.card-content) {
    gap: 0.6rem;
}

.prose-card:has(.prose-title-link:focus-visible) {
    outline: 2px solid var(--prose-type-color);
    outline-offset: 3px;
}

.prose-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
}

.author-row {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    overflow: hidden;
}

.author-row :deep(.avatar-item) {
    flex-shrink: 0;
}

.author-row :deep(.username-link) {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.created-at {
    flex-shrink: 0;
    color: var(--main-text);
    opacity: 0.65;
    font-size: 0.9rem;
    white-space: nowrap;
}

.meta-dot {
    margin-right: 0.35rem;
}

.prose-title {
    margin: 0.15rem 0 0;
    font-size: 1.3rem;
    line-height: 1.3;
}

.prose-title-link {
    color: var(--accent-blue);
    text-decoration: none;
}

.prose-title-link::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
}

.prose-title-link:focus-visible {
    outline: none;
}

.prose-blurb {
    margin: 0;
    color: var(--main-text);
    opacity: 0.8;
    font-size: 0.95rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 0.25rem;
}

.read-cue {
    flex-shrink: 0;
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--prose-type-color);
    font-size: 0.98rem;
    font-weight: 600;
}

.read-arrow {
    transition: transform 0.2s ease;
}

.prose-card:hover .read-arrow,
.prose-card:has(.prose-title-link:focus-visible) .read-arrow {
    transform: translateX(4px);
}

/* Compact (favorites) */
.prose-card--compact :deep(.card-content) {
    gap: 0.4rem;
}

.prose-card--compact .created-at {
    font-size: 0.78rem;
}

.prose-card--compact .prose-title {
    font-size: 1rem;
}

.prose-card--compact .prose-blurb {
    font-size: 0.85rem;
    -webkit-line-clamp: 1;
    line-clamp: 1;
}

.prose-card--compact .read-cue {
    font-size: 0.84rem;
}

@media (max-width: 768px) {
    .prose-card :deep(.card-content) {
        padding: 0.9rem 1rem;
    }

    .created-at {
        font-size: 0.78rem;
    }

    .prose-title {
        font-size: 1.05rem;
    }

    .prose-blurb {
        font-size: 0.875rem;
        line-height: 1.45;
        -webkit-line-clamp: 2;
        line-clamp: 2;
    }

    .read-cue {
        font-size: 0.88rem;
    }
}
</style>
