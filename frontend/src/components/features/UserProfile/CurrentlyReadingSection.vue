<template>
    <UserContentSection sectionTitle="CURRENTLY READING">
        <div class="content">
            <div v-if="currentlyReading" class="book">
                <div class="cover-and-info">
                    <img
                        v-if="currentlyReading.imageSrc"
                        class="cover"
                        :src="currentlyReading.imageSrc"
                        :alt="currentlyReading.title"
                    />
                    <div v-else class="cover-placeholder">
                        <FontAwesomeIcon :icon="faBookOpenReader" />
                    </div>

                    <div class="info">
                        <h4 class="title">{{ currentlyReading.title }}</h4>

                        <div class="author-and-meta">
                            <p class="author">{{ currentlyReading.author }}</p>
                            <span
                                v-if="currentlyReading.yearPublished"
                                class="separator"
                                >|</span
                            >
                            <p
                                v-if="currentlyReading.yearPublished"
                                class="meta"
                            >
                                {{ currentlyReading.yearPublished }}
                            </p>
                        </div>

                        <div v-if="currentlyReading.tags?.length" class="tags">
                            <BookTag
                                v-for="tag in currentlyReading.tags.slice(0, 3)"
                                :key="tag"
                                :tag="tag"
                                :selected="true"
                                color="blue"
                                :size="mobile ? 'xsmall' : 'small'"
                            />
                        </div>
                    </div>
                </div>

                <p v-if="currentlyReading.description" class="description">
                    {{ currentlyReading.description }}
                </p>
            </div>

            <div v-else class="empty">
                <p class="empty-title">no book set</p>
                <p class="empty-subtitle">
                    toss something in “currently reading” from the shelf modal
                </p>
            </div>
        </div>
    </UserContentSection>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import type { FutureBook } from "@/types";
import BookTag from "@/components/ui/BookTag.vue";
import UserContentSection from "./UserContentSection.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBookOpenReader } from "@fortawesome/free-solid-svg-icons";

defineOptions({ name: "CurrentlyReadingSection" });

defineProps<{
    currentlyReading?: FutureBook | null;
}>();

const { mobile } = useDisplay();
</script>

<style scoped>
.currently-reading-section {
    width: 50%;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent-blue) 12%, transparent),
        color-mix(in srgb, var(--accent-blue) 6%, transparent)
    );
    border: 2px solid var(--accent-blue);
    border-radius: 1rem;
    padding: 1rem;
    box-shadow:
        0 4px 8px color-mix(in srgb, var(--accent-blue) 25%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: 100%;
    font-size: 1.25rem;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.section-title {
    margin: 0;
    color: var(--accent-blue);
    font-family: "Libre Baskerville", serif;
    font-size: 1.1rem;
    letter-spacing: 0.2px;
}

.book {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.cover-and-info {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
}

.cover {
    flex: 0 0 60px;
    width: 60px;
    height: 90px;
    object-fit: cover;
    border-radius: 0.5rem;
    border: 1px solid var(--accent-blue);
}

.cover-placeholder {
    flex: 0 0 60px;
    width: 60px;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.1),
        rgba(0, 191, 255, 0.05)
    );
    border: 2px dashed var(--accent-blue);
    border-radius: 0.5rem;
    color: var(--accent-blue);
    font-size: 1.5rem;
}

.info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
}

.title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    font-style: italic;
    line-height: 1.3;
}

.author-and-meta {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    opacity: 0.85;
    flex-wrap: wrap;
}

.author {
    margin: 0;
    color: var(--accent-blue);
}

.separator {
    color: var(--accent-blue);
    font-weight: 600;
    opacity: 0.6;
}

.meta {
    margin: 0;
    color: var(--main-text);
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: 0.25rem;
}

.description {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.4;
    color: var(--main-text);
    opacity: 0.9;
    padding-top: 0.5rem;
    border-top: 1px solid var(--accent-blue);
    border-left: 1px solid var(--accent-blue);
    border-top-left-radius: 0.5rem;
    padding-left: 0.5rem;
    padding-top: 0.25rem;
}

.empty {
    flex: 1;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 1rem;
    border-radius: 1rem;
    border: 2px dashed var(--accent-blue);
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 12px rgba(0, 191, 255, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.empty-title {
    margin: 0;
    font-weight: 600;
    color: var(--accent-blue);
}

.empty-subtitle {
    margin: 0;
    text-align: center;
    color: var(--main-text);
    opacity: 0.85;
    font-style: italic;
}

@media (max-width: 768px) {
    .currently-reading-section {
        width: 100%;
        min-height: 120px;
        gap: 1rem;
    }

    .content {
        font-size: 1rem;
    }

    .section-title {
        font-size: 1rem;
    }
}

@media (min-width: 768px) {
    .cover,
    .cover-placeholder {
        flex: 0 0 80px;
        width: 80px;
        height: 120px;
    }

    .cover-placeholder {
        font-size: 2rem;
    }

    .title {
        font-size: 1.375rem;
    }

    .author-and-meta {
        font-size: 1.25rem;
    }

    .description {
        font-size: 1.125rem;
        padding-top: 0.75rem;
        padding-left: 0.75rem;
    }

    .tags {
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
}
</style>
