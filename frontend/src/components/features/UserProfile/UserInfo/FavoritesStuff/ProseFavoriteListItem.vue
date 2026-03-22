<template>
    <div class="prose-favorite-card-container" :style="accentSurfaceStyle">
        <div class="prose-favorite-card-inner">
            <div class="cover-and-info">
                <RouterLink
                    :to="`/prose/${entry.id}`"
                    class="avatar-link"
                    tabindex="-1"
                >
                    <AvatarImage
                        :avatar="entry.userInfo.avatar"
                        :avatarType="entry.userInfo.avatarType || 'icon'"
                        size="small"
                    />
                </RouterLink>

                <div class="info">
                    <div class="prose-header">
                        <div class="author-row">
                            <UsernameLink
                                :username="entry.userInfo.username"
                                fontSize="small"
                            />
                            <ProseTypePill :type="entry.type" />
                        </div>
                        <div class="header-right">
                            <span class="created-at">{{ createdAtLabel }}</span>
                        </div>
                    </div>

                    <RouterLink :to="`/prose/${entry.id}`" class="title-link">
                        <h3 class="prose-title">{{ entry.title }}</h3>
                    </RouterLink>
                </div>
            </div>

            <BlurbSection
                :blurb="entry.excerpt"
                compact
                empty-message="bro failed to provide any context for this. probably for the best. guess you'll just have to FAFO."
            />

            <div class="footer-row">
                <ProseReactionPills :entry="entry" />
                <RouterLink :to="`/prose/${entry.id}`">
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
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useDisplay } from "vuetify";
import type { ProseEntry } from "@/types";
import { getProseTypeColor } from "@/utils";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import UsernameLink from "@/components/ui/UsernameLink.vue";
import GlassesIcon from "@/components/icons/GlassesIcon.vue";
import BlurbSection from "@/components/features/Prose/ProseDetail/BlurbSection.vue";
import ProseTypePill from "@/components/features/Prose/ProseTypePill.vue";
import ProseReactionPills from "@/components/features/Prose/ProseReactionPills.vue";

const props = defineProps<{
    entry: ProseEntry;
    isLoggedInUser?: boolean;
}>();

const { mobile } = useDisplay();

const typeAccent = computed(() => getProseTypeColor(props.entry.type));

const accentSurfaceStyle = computed(() => {
    const c = typeAccent.value;
    return {
        borderColor: `var(--accent-${c})`,
        boxShadow: `0 4px 10px var(--accent-${c}), 0 0 20px var(--accent-${c}), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
    };
});

const createdAtLabel = computed(() => {
    const date = new Date(props.entry.createdAt);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
});
</script>

<style scoped>
.prose-favorite-card-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid var(--accent-blue);
    border-radius: 1rem;
    padding: 0.5rem;
    background-color: var(--surface-color);
    flex: 1 0 100%;
}

.prose-favorite-card-inner {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.5rem;
}

.cover-and-info {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
}

.avatar-link {
    flex-shrink: 0;
    text-decoration: none;
    color: inherit;
}

.info {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    flex: 1;
    min-width: 0;
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

.author-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow: hidden;
}

.author-row :deep(.author) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.header-right {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
}

.created-at {
    color: var(--main-text);
    opacity: 0.8;
    font-size: 0.95rem;
    flex-shrink: 0;
}

.title-link {
    text-decoration: none;
    color: inherit;
    min-width: 0;
}

.prose-title {
    margin: 0;
    padding-left: 0.5rem;
    color: var(--accent-blue);
    font-size: 1.25rem;
    line-height: 1.35;
}

.footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.prose-favorite-card-inner :deep(.count-pill.medium) {
    font-size: 0.75rem !important;
    padding: 0.175rem 0.35rem !important;
    gap: 0.25rem !important;
}

@media (min-width: 768px) {
    .prose-favorite-card-container {
        flex: 1 0 60%;
    }

    .prose-favorite-card-inner {
        gap: 1rem;
        padding: 0.75rem;
    }

    .cover-and-info {
        gap: 1rem;
    }
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

    .header-right {
        gap: 0.5rem;
    }
}
</style>
