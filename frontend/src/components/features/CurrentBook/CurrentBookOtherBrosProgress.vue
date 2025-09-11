<template>
    <BaseCard
        class="current-book-other-bros-progress"
        shadow-color="green"
        size="medium"
    >
        <h3>where your bros at?</h3>
        <div class="other-bros-progress-container">
            <div class="other-bro-progress">
                <p>Joel Braxton</p>
                <p class="progress-value">finished</p>
            </div>
            <div class="other-bro-progress">
                <p>Judd Prasnicky</p>
                <p class="progress-value">page 0 / 279</p>
            </div>
            <div class="other-bro-progress">
                <p>Ken McGurran</p>
                <p class="progress-value">page 70 / 279</p>
            </div>
            <div class="other-bro-progress">
                <p>Chris Dub</p>
                <p class="progress-value">finished</p>
            </div>
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
</script>

<style scoped>
.current-book-other-bros-progress {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.other-bros-progress-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.other-bro-progress {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

h3 {
    font-size: 1.5rem;
    font-weight: 600;
    border-bottom: 2px solid var(--accent-blue);
    padding-bottom: 0.1rem;
    width: fit-content;
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

@media (max-width: 768px) {
    h3 {
        font-size: 1.25rem;
    }

    p {
        font-size: 1.125rem;
    }

    .progress-value {
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    h3 {
        font-size: 1.125rem;
    }
}
</style>
