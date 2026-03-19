<template>
    <RouterLink :to="`/prose/${entry.id}`" class="prose-link">
        <BaseCard
            :shadow-color="typeColor"
            :size="cardSize"
            :hoverable="true"
            class="prose-card"
            :class="{ 'prose-card--compact': compact }"
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
                        fontSize="small"
                    />
                    <ProseTypePill :type="entry.type" />
                </div>
                <div class="header-right">
                    <span class="created-at">{{ createdAtLabel }}</span>
                    <div v-if="compact" class="header-reactions">
                        <ReactionPill
                            type="comment"
                            :count="entry.comments?.length || 0"
                        />
                        <ReactionPill
                            type="like"
                            :count="entry.likes?.length || 0"
                        />
                        <ReactionPill
                            type="dislike"
                            :count="entry.dislikes?.length || 0"
                        />
                    </div>
                </div>
            </div>

            <h3 class="prose-title">{{ entry.title }}</h3>

            <BlurbSection
                :blurb="entry.excerpt"
                compact
                empty-message="bro failed to provide any context for this. probably for the best. guess you'll just have to FAFO."
            />

            <div v-if="!compact" class="preview-wrap">
                <ExpandableText
                    :text="previewText"
                    :truncateLength="truncateLength"
                    :hideMoreButton="true"
                />
            </div>

            <div class="footer-row">
                <div v-if="!compact" class="meta-row">
                    <ReactionPill
                        type="comment"
                        :count="entry.comments?.length || 0"
                    />
                    <ReactionPill
                        type="like"
                        :count="entry.likes?.length || 0"
                    />
                    <ReactionPill
                        type="dislike"
                        :count="entry.dislikes?.length || 0"
                    />
                </div>
                <RouterLink v-if="!compact" :to="`/prose/${entry.id}`">
                    <BaseButton
                        :size="mobile ? 'xsmall' : 'small'"
                        variant="outline-tertiary"
                        title="peep deets'"
                    >
                        <GlassesIcon />
                        peep deets
                    </BaseButton>
                </RouterLink>
            </div>
        </BaseCard>
    </RouterLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { RouterLink } from "vue-router";
import ProseTypePill from "./ProseTypePill.vue";
import ReactionPill from "@/components/features/common/ReactionPill.vue";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import GlassesIcon from "@/components/icons/GlassesIcon.vue";
import ExpandableText from "@/components/features/common/ExpandableText.vue";
import BlurbSection from "@/components/features/Prose/ProseDetail/BlurbSection.vue";
import type { ProseEntry } from "@/types";
import { getPlainTextFromMarkdown, getProseTypeColor } from "@/utils";

const props = defineProps<{
    entry: ProseEntry;
    /** Smaller rendition used inside Favorites section. */
    compact?: boolean;
}>();

const { mobile } = useDisplay();

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
    return getProseTypeColor(props.entry.type);
});

const previewText = computed(() => {
    return getPlainTextFromMarkdown(props.entry.markdown || "");
});

const truncateLength = computed(() => {
    return props.entry.type === "poetic" ? 40 : 220;
});

const cardSize = computed(() => {
    if (props.compact) return "small";
    return mobile.value ? "small" : "medium";
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

.prose-card--compact :deep(.count-pill.medium) {
    font-size: 0.75rem !important;
    padding: 0.175rem 0.35rem !important;
    gap: 0.25rem !important;
}

.prose-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: nowrap;
}

.prose-header .author-row {
    flex: 1;
    min-width: 0;
    justify-content: flex-start;
}

.prose-header .created-at {
    flex-shrink: 0;
}

.header-right {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
}

.header-reactions {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.created-at {
    color: var(--main-text);
    opacity: 0.8;
    font-size: 0.95rem;
}

.prose-title {
    margin: 0;
    padding-left: 0.5rem;
    color: var(--accent-blue);
    font-size: 1.25rem;
    line-height: 1.35;
}

.author-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow: hidden;
}

.author-row .author {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.author {
    color: var(--accent-lavender);
    font-size: 1rem;
}

.footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.meta-row {
    display: flex;
    gap: 1rem;
    color: var(--main-text);
    opacity: 0.8;
    font-size: 0.95rem;
}

.preview-wrap {
    font-size: inherit;
}

.prose-card--compact .prose-header {
    gap: 0.45rem;
}

.prose-card--compact .header-right {
    gap: 0.5rem;
}

.prose-card--compact .header-reactions {
    gap: 0.35rem;
}

.prose-card--compact .created-at {
    font-size: 0.8rem;
}

.prose-card--compact .prose-title {
    font-size: 1rem;
    padding-left: 0.4rem;
}

.prose-card--compact .meta-row {
    font-size: 0.8rem;
    gap: 0.65rem;
}

.prose-card--compact .footer-row {
    gap: 0.35rem;
}

.prose-card--compact .author {
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .prose-header {
        gap: 0.5rem;
    }

    .created-at {
        font-size: 0.8rem;
    }

    .prose-title {
        font-size: 0.75rem;
    }

    .author {
        font-size: 0.875rem;
    }

    .preview-wrap {
        font-size: 0.875rem;
        line-height: 1.45;
    }

    .meta-row {
        gap: 0.5rem;
        font-size: 0.8rem;
    }
}
</style>
