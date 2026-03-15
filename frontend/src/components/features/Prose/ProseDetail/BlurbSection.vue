<template>
    <div v-if="hasContent" class="blurb-section" :class="{ compact }">
        <p class="blurb-section-title">about this piece</p>
        <p v-if="displayText" class="blurb-text">{{ displayText }}</p>
        <p v-else class="blurb-text blurb-empty">{{ emptyMessage }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        blurb?: string;
        emptyMessage?: string;
        compact?: boolean;
    }>(),
    {
        blurb: "",
        emptyMessage: "",
        compact: false,
    }
);

const displayText = computed(() => props.blurb?.trim() || "");

const hasContent = computed(
    () => displayText.value.length > 0 || (props.emptyMessage?.length ?? 0) > 0
);
</script>

<style scoped>
.blurb-section {
    background: color-mix(in srgb, var(--accent-lavender) 12%, transparent);
    border: 1px solid
        color-mix(in srgb, var(--accent-lavender) 45%, transparent);
    border-radius: 0.75rem;
    padding: 0.75rem 0.9rem;
    margin: 0 0 0.75rem;
}

.blurb-section-title {
    margin: 0 0 0.4rem;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent-lavender);
    opacity: 0.95;
}

.blurb-text {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--main-text);
    opacity: 0.92;
}

.blurb-text.blurb-empty {
    font-style: italic;
    opacity: 0.8;
}

.blurb-section.compact {
    padding: 0.5rem 0.65rem;
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
}

.blurb-section.compact .blurb-section-title {
    font-size: 0.7rem;
    margin-bottom: 0.25rem;
}

.blurb-section.compact .blurb-text {
    font-size: 0.875rem;
    line-height: 1.4;
}

@media (min-width: 768px) {
    .blurb-section {
        padding: 0.9rem 1rem;
        margin-bottom: 0.9rem;
    }

    .blurb-section-title {
        font-size: 0.85rem;
    }

    .blurb-text {
        font-size: 1rem;
    }

    .blurb-section.compact {
        padding: 0.6rem 0.75rem;
        margin-bottom: 0.6rem;
    }

    .blurb-section.compact .blurb-section-title {
        font-size: 0.75rem;
    }

    .blurb-section.compact .blurb-text {
        font-size: 0.9rem;
    }
}
</style>
