<template>
    <BaseButton
        v-if="true"
        :variant="userHasVoted ? 'outline-error' : 'outline-success'"
        size="small"
        class="vote-button"
        :title="
            userHasVoted
                ? 'unvote for this book'
                : 'vote for this book to be read next'
        "
        @click="handleVote"
    >
        {{ userHasVoted ? "unvote" : "vote" }}
        <FontAwesomeIcon :icon="userHasVoted ? faBookSkull : faBookMedical" />
    </BaseButton>
</template>

<script setup lang="ts">
import { faBookSkull, faBookMedical } from "@fortawesome/free-solid-svg-icons";

defineProps<{
    userHasVoted: boolean;
    handleVote: () => void;
}>();
</script>

<style scoped>
.actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.votes {
    display: flex;
    align-items: baseline;
    gap: 0.375rem;
    font-size: 1.5rem;
    color: var(--accent-blue);
}

.count {
    font-weight: 700;
    color: var(--accent-fuschia);
}

.label {
    opacity: 0.8;
}

@media (max-width: 768px) {
    .vote-button {
        font-size: 0.9rem;
        padding: 0.25rem 0.5rem;
    }
}
</style>
