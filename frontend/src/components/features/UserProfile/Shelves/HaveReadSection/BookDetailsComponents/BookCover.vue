<template>
    <div class="cover-wrap">
        <img
            v-if="book.imageSrc"
            class="cover"
            :src="book.imageSrc"
            :alt="book.title"
        />
        <div v-else class="cover-placeholder">
            <FontAwesomeIcon :icon="faBook" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BookshelfBook } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

defineProps<{
    book: BookshelfBook;
}>();
</script>

<style scoped>
.cover-wrap {
    flex: 0 0 auto;
}

.cover {
    width: 110px;
    height: 160px;
    object-fit: cover;
    border-radius: 0.75rem;
    border: 1px solid var(--accent-green);
}

.cover-placeholder {
    width: 110px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    border: 2px dashed var(--accent-green);
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent-green) 12%, transparent),
        color-mix(in srgb, var(--accent-green) 6%, transparent)
    );
    color: var(--accent-green);
    font-size: 2rem;
}

@media (max-width: 768px) {
    .cover,
    .cover-placeholder {
        width: 84px;
        height: 122px;
    }
}
</style>
