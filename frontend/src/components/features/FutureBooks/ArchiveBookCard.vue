<template>
    <BaseCard
        :shadow-color="isHighlighted ? 'green' : 'lavender'"
        size="small"
        class="archive-card"
        :style="{ backdropFilter: 'blur(2px)' }"
    >
        <div class="card-header">
            <div class="title-and-icon">
                <h3 class="title">{{ book.title }}</h3>
                <FontAwesomeIcon
                    v-if="iconProps.faIcon"
                    :icon="iconProps.faIcon"
                    :style="{
                        color: iconProps.iconColor,
                    }"
                />
            </div>
            <span class="author">{{ book.author }}</span>
        </div>
        <p class="description">{{ book.description }}</p>
        <div class="meta">
            <div class="tags">
                <BookTag
                    v-for="tag in book.tags"
                    :key="tag"
                    :tag="tag"
                    :selected="true"
                    color="blue"
                    :size="mobile ? 'small' : 'medium'"
                >
                </BookTag>
            </div>
            <div class="votes">{{ voteLabel }}</div>
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { FutureBook } from "@/types";
import { faBookOpenReader } from "@fortawesome/free-solid-svg-icons";
import BookTag from "@/components/ui/BookTag.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const props = defineProps<{
    book: FutureBook;
    isHighlighted: boolean;
}>();

const voteLabel = computed(() =>
    props.book.votes?.length === 1
        ? "1 vote"
        : `${props.book.votes?.length} votes`
);
const iconProps = computed(() => {
    if (props.isHighlighted) {
        return {
            iconColor: "var(--accent-green)",
            faIcon: faBookOpenReader,
        };
    }
    return {
        iconColor: null,
        faIcon: null,
    };
});
</script>

<style scoped>
.archive-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.card-header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.title-and-icon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.25rem;
}

.title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: var(--accent-blue);
}

.author {
    font-size: 1rem;
    color: var(--main-text);
    opacity: 0.8;
}

.description {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.4;
    color: var(--main-text);
    opacity: 0.85;
    border-top: 2px solid var(--accent-blue);
    border-left: 2px solid var(--accent-blue);
    border-top-left-radius: 1rem;
    padding: 0.5rem;
}

.meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    gap: 0.5rem;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.tag {
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
    border: 1px solid var(--accent-fuschia);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.votes {
    flex: 1 0 auto;
    font-size: 1rem;
    font-weight: 600;
    color: var(--accent-green);
    text-align: right;
}

@media (max-width: 768px) {
    .title {
        font-size: 1.125rem;
    }
    .author {
        font-size: 0.9rem;
    }
    .description {
        font-size: 0.9rem;
    }
    .votes {
        font-size: 0.85rem;
    }
}
</style>
