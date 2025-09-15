<template>
    <div class="current-book-layout">
        <PageTitle title="current prose ferda bros" />
        <div v-if="isMobile" class="layout-column">
            <slot name="current-book" />
            <slot name="user-progress" />
            <slot name="other-bros-progress" />
        </div>
        <div v-else class="layout-row">
            <div class="layout-column">
                <slot name="current-book" />
                <slot name="other-bros-progress" />
            </div>
            <slot name="user-progress" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/ui/PageTitle.vue";

const { isMobile } = storeToRefs(useUIStore());
</script>

<style scoped>
.current-book-layout {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 2rem;
}

.layout-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    gap: 2rem;
}

.layout-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 3rem;
    width: 100%;
    height: 100%;
}

@media (min-width: 768px) {
    .current-book-layout {
        gap: 3rem;
    }
}
</style>
