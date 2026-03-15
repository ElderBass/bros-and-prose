<template>
    <RouterLink :to="`/prose/${entry.id}`" class="prose-link">
        <BaseCard
            :shadow-color="typeColor"
            :size="cardSize"
            :hoverable="true"
            class="prose-card"
        >
            <div class="prose-header">
                <div class="author-row">
                    <AvatarImage
                        :avatar="entry.userInfo.avatar"
                        :avatarType="entry.userInfo.avatarType || 'icon'"
                        size="xsmall"
                    />
                    <span class="author">@{{ entry.userInfo.username }}</span>
                    <span class="type-pill">{{ entry.type }}</span>
                </div>
                <span class="created-at">{{ createdAtLabel }}</span>
            </div>

            <h3 class="prose-title">{{ entry.title }}</h3>

            <div class="preview-wrap">
                <ExpandableText
                    :text="previewText"
                    :truncateLength="truncateLength"
                    :hideMoreButton="true"
                />
            </div>

            <div class="footer-row">
                <div class="meta-row">
                    <span>{{ entry.comments?.length || 0 }} comments</span>
                    <span>{{ entry.likes?.length || 0 }} likes</span>
                    <span>{{ entry.dislikes?.length || 0 }} dislikes</span>
                </div>
                <RouterLink :to="`/prose/${entry.id}`">
                    <BaseButton
                        :size="mobile ? 'xsmall' : 'small'"
                        variant="outline-tertiary"
                        title="peep deets'"
                    >
                        <FontAwesomeIcon :icon="faGlasses" />
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
import AvatarImage from "@/components/ui/AvatarImage.vue";
import ExpandableText from "@/components/features/common/ExpandableText.vue";
import type { ProseEntry } from "@/types";
import { getPlainTextFromMarkdown } from "@/utils";
import { faGlasses } from "@fortawesome/free-solid-svg-icons";

const props = defineProps<{
    entry: ProseEntry;
}>();

const emit = defineEmits<{
    (e: "edit", entry: ProseEntry): void;
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

const truncateLength = computed(() => {
    return props.entry.type === "poetic" ? 40 : 220;
});

const cardSize = computed(() => {
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

.type-pill {
    flex-shrink: 0;
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

@media (max-width: 768px) {
    .prose-header {
        gap: 0.5rem;
    }

    .type-pill {
        padding: 0.1rem 0.5rem;
        font-size: 0.75rem;
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
