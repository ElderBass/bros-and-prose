<template>
    <div class="text-sections">
        <div v-if="blurb" class="text-section user-blurb-section">
            <h4 class="section-label">{{ possessiveLabel }} dumbass blurb</h4>
            <ExpandableText :text="blurb" :truncateLength="200" />
        </div>
        <div v-if="showDescription" class="text-section">
            <h4 class="section-label">elite synopsis</h4>
            <ExpandableText :text="description" :truncateLength="100" />
        </div>
    </div>
</template>

<script setup lang="ts">
import ExpandableText from "@/components/features/common/ExpandableText.vue";
import { EMPTY_TEXT, EMPTY_GOOGLE_TEXT } from "@/constants";

withDefaults(
    defineProps<{
        blurb?: string;
        description?: string;
        possessiveLabel?: string;
        showDescription?: boolean;
    }>(),
    {
        blurb: EMPTY_TEXT,
        description: EMPTY_GOOGLE_TEXT,
        showDescription: true,
        possessiveLabel: "bro's",
    }
);
</script>

<style scoped>
.text-sections {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.text-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.section-label {
    margin: 0;
    padding-left: 0.25rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--accent-blue);
    text-transform: lowercase;
    opacity: 0.8;
    text-align: left;
}

.user-blurb-section .section-label {
    color: var(--accent-fuschia);
}

@media (min-width: 768px) {
    .section-label {
        padding-left: 0.5rem;
        font-size: 1.25rem;
    }
}
</style>
