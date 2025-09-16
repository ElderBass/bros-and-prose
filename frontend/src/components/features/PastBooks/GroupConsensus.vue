<template>
    <div class="group-consensus">
        <PageTitle title="broverall consensus..." />
        <div class="average-rating-container">
            <p class="average-rating">average score:</p>
            <span class="average-rating-value">{{ averageRating }}</span>
        </div>
        <div class="group-consensus-container">
            <p class="consensus-text">{{ groupConsensus }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import PageTitle from "@/components/ui/PageTitle.vue";

defineProps<{
    groupConsensus: string;
    averageRating: string;
}>();
</script>

<style scoped>
.group-consensus {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 2px solid var(--accent-blue);
    border-radius: 1.5rem;
    padding: 1.5rem;
    margin: 0 auto;
}

.average-rating-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

.average-rating {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--accent-blue);
}

.average-rating-value {
    font-size: 2rem;
    font-family: "Crimson Text", serif;
    font-style: italic;
    font-weight: 600;
    color: var(--accent-fuschia);
}

.group-consensus-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.consensus-text-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.consensus-text {
    font-size: 1.25rem;
    line-height: 1.6;
    color: var(--main-text);
    margin: 0;
    padding: 0.5rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    border-left: 1px solid var(--accent-blue);
    border-top: 1px solid var(--accent-blue);
    border-top-left-radius: 0.5rem;
}

@media (max-width: 768px) {
    .group-consensus {
        padding: 1rem;
    }

    .average-rating-value {
        font-size: 1.5rem;
    }

    .average-rating {
        font-size: 1.25rem;
    }

    .consensus-text {
        font-size: 1.125rem;
        line-height: 1.4;
    }
}
</style>
