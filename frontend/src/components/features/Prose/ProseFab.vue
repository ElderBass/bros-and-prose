<template>
    <div class="prose-fab">
        <FloatingActionButton
            :icon="faPenNib"
            title="write a prose piece"
            style="background-color: var(--background-color)"
            @click="emit('click')"
        />
    </div>
</template>

<script setup lang="ts">
import { faPenNib } from "@fortawesome/free-solid-svg-icons";

const emit = defineEmits<{
    (e: "click"): void;
}>();
</script>

<style scoped>
.prose-fab {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 100;
}
</style>
