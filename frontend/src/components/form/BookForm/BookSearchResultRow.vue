<template>
    <button
        type="button"
        class="result"
        :class="{ selected }"
        @click="emit('select')"
    >
        <img
            v-if="result.imageSrc"
            class="result-cover"
            :src="result.imageSrc"
            :alt="result.title"
        />
        <div v-else class="result-cover-placeholder">
            <FontAwesomeIcon :icon="faBook" />
        </div>

        <div class="result-info">
            <p class="result-title-text">{{ result.title }}</p>
            <p class="result-meta">
                <span class="result-author">{{
                    result.author || "unknown author"
                }}</span>
                <span v-if="result.yearPublished" class="dot">•</span>
                <span v-if="result.yearPublished" class="result-year">{{
                    result.yearPublished
                }}</span>
            </p>
        </div>
    </button>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import type { BookFormSearchResult } from "./types";

const emit = defineEmits<{
    (e: "select"): void;
}>();

defineProps<{
    result: BookFormSearchResult;
    selected: boolean;
}>();
</script>

<style scoped>
.result {
    width: 100%;
    display: grid;
    grid-template-columns: 56px 1fr;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid var(--accent-blue);
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.08),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 16px rgba(0, 191, 255, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    cursor: pointer;
    text-align: left;
    transition:
        transform 0.12s ease,
        box-shadow 0.12s ease,
        border-color 0.12s ease;
}

.result:hover {
    transform: translateY(-1px);
    box-shadow:
        0 6px 18px rgba(0, 191, 255, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.result.selected {
    border-color: var(--accent-fuschia);
    box-shadow:
        0 6px 18px rgba(255, 0, 255, 0.18),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.result-cover {
    width: 56px;
    height: 84px;
    object-fit: cover;
    border-radius: 0.5rem;
    border: 1px solid var(--accent-blue);
}

.result-cover-placeholder {
    width: 56px;
    height: 84px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: 2px dashed var(--accent-blue);
    color: var(--accent-blue);
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.1),
        rgba(0, 191, 255, 0.05)
    );
}

.result-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
}

.result-title-text {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    font-style: italic;
    line-height: 1.3;
}

.result-meta {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--main-text);
    opacity: 0.85;
    flex-wrap: wrap;
}

.result-author {
    color: var(--accent-blue);
}

.dot {
    opacity: 0.6;
}
</style>
