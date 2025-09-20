<template>
    <BaseTooltip
        text="go to your profile you pussy"
        shadow-color="fuschia"
        :open-delay="750"
        :disabled="false"
        :show-tooltip="true"
        location="bottom"
    >
        <template #activator="{ props: tooltipProps }">
            <button
                v-bind="tooltipProps"
                type="button"
                class="user-actions desktop-nav"
                @click="handleClick"
            >
                <FontAwesomeIcon :icon="currentAvatar" />
            </button>
        </template>
    </BaseTooltip>
</template>

<script setup lang="ts">
import type { AvatarProp } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps<{
    currentAvatar: AvatarProp;
    handleClick: () => void;
}>();
</script>

<style scoped>
.user-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    border: 2px solid var(--accent-blue);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: var(--background-color);
}

.user-actions:hover {
    background-color: var(--accent-blue);
    color: var(--background-color);
}

.user-actions:hover {
    background-color: var(--accent-blue);
    color: var(--background-color);
}

.user-actions:active {
    background-color: var(--accent-blue);
    color: var(--background-color);
}

.user-actions:focus {
    background-color: var(--accent-blue);
    color: var(--background-color);
}

.desktop-nav {
    display: flex;
}

@media (max-width: 768px) {
    .desktop-nav {
        display: none;
    }
}
</style>
