<template>
    <FloatingActionButton
        :icon="faCommentMedical"
        title="add an inbrospective comment"
        style="background-color: var(--background-color)"
        @click="() => $emit('click')"
    />
</template>

<script setup lang="ts">
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";
</script>

<style scoped>
.add-comment-fab-container {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
}
</style>
