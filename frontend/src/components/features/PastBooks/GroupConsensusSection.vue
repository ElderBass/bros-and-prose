<template>
    <div class="group-consensus-container">
        <div class="group-consensus">
            <PageTitle title="broverall consensus..." />
            <div class="average-rating-container">
                <p class="average-rating">average score:</p>
                <span v-if="averageRating" class="average-rating-value">{{
                    averageRating
                }}</span>
                <span v-else class="average-rating-value">nunya</span>
            </div>
            <div v-if="groupConsensus" class="group-consensus-container">
                <p class="consensus-text">{{ groupConsensus }}</p>
            </div>
            <div v-else class="no-group-consensus">
                <p>the bros have not yet reached a consensus</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import PageTitle from "@/components/ui/PageTitle.vue";

defineProps<{
    groupConsensus?: string;
    averageRating?: string;
}>();
</script>

<style scoped>
.group-consensus-container {
    margin-top: 2rem;
    width: 100%;
}

.group-consensus {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 2px solid var(--accent-blue);
    border-radius: 1.5rem;
    padding: 1.5rem;
    margin: 0 auto;
    width: 100%;
}

.no-group-consensus {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    padding: 2rem;
    margin: 0 auto;

    border: 2px dashed var(--accent-blue);
    border-radius: 1rem;

    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );

    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);

    color: var(--main-text);
}

.no-group-consensus p {
    margin: 0;
    font-style: italic;
    opacity: 0.85;
    letter-spacing: 0.3px;
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

    .no-group-consensus {
        padding: 1.25rem;
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
