<template>
    <img v-if="imageSrc" class="cover" :src="imageSrc" :alt="title" />
    <div v-else class="cover-placeholder">
        <FontAwesomeIcon :icon="faBook" />
    </div>
</template>

<script setup lang="ts">
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps<{
    imageSrc?: string;
    title: string;
}>();
</script>

<style scoped>
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
}
</style>
