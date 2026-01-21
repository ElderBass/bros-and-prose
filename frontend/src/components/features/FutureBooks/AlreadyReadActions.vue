<template>
    <BaseButton
        :variant="userHasMarkedRead ? 'outline-warning' : 'outline-secondary'"
        size="small"
        class="already-read-button"
        :title="
            userHasMarkedRead
                ? `on second thought, I ain't read shit`
                : 'been there, read that'
        "
        @click="handleToggle"
    >
        {{ userHasMarkedRead ? "unmark" : "mark as read" }}
        <FontAwesomeIcon :icon="userHasMarkedRead ? faCheck : faBookOpen" />
    </BaseButton>
</template>

<script setup lang="ts">
import { faBookOpen, faCheck } from "@fortawesome/free-solid-svg-icons";

defineProps<{
    userHasMarkedRead: boolean;
    handleToggle: () => void;
}>();
</script>

<style scoped>
@media (max-width: 768px) {
    .already-read-button {
        font-size: 0.9rem;
        padding: 0.25rem 0.5rem;
    }
}
</style>
