<template>
    <div class="other-bro-progress-item">
        <p>{{ props.broName }}</p>
        <div class="progress-value-container">
            <p :class="{ finished: props.hasFinished }" class="progress-value">
                {{ props.progressString }}
            </p>
            <BaseButton
                v-if="props.hasFinished"
                @click="props.onPeepReviewClick"
                size="xsmall"
                variant="outline"
                title="peep this bro's review which is probably way smarter than yours"
            >
                peep review
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
    broName: string;
    hasFinished: boolean;
    progressString: string;
    onPeepReviewClick: () => void;
}>();
</script>

<style scoped>
.other-bro-progress-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.progress-value-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 0.5rem;
}

p {
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--main-text);
}

.progress-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--accent-lavender);
}

.finished {
    color: var(--accent-fuschia);
}

@media (max-width: 768px) {
    p {
        font-size: 1.125rem;
    }

    .progress-value {
        font-size: 1rem;
    }
}
</style>
