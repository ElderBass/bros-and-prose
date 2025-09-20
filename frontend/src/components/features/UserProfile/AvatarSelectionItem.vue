<template>
    <div
        class="avatar-selection-item"
        :class="{ 'is-selected': props.isSelected }"
        @click="handleAvatarClick(props.icon.iconName)"
    >
        <AvatarImage
            :icon="props.icon"
            :size="isMobile ? 'medium' : 'xlarge'"
        />
        <p>{{ props.friendlyName }}</p>
    </div>
</template>

<script setup lang="ts">
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";

const emit = defineEmits<{
    "update:avatar": [value: string];
}>();

const props = defineProps<{
    icon: IconDefinition;
    friendlyName: string;
    isSelected: boolean;
}>();

const { isMobile } = storeToRefs(useUIStore());

const handleAvatarClick = (icon: string) => {
    emit("update:avatar", icon);
};
</script>

<style scoped>
.avatar-selection-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--accent-blue);
    border-radius: 1rem;
    padding: 1rem;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 128px;
    &:hover {
        box-shadow:
            0 4px 20px var(--accent-blue),
            0 0 40px var(--accent-blue),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        transform: scale(1.05);
    }
}

.avatar-selection-item.is-selected {
    color: var(--accent-fuschia);
    border-color: var(--accent-fuschia);
    box-shadow:
        0 4px 20px var(--accent-fuschia),
        0 0 40px var(--accent-fuschia),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
}

p {
    font-size: 1.25rem;
}

@media (max-width: 768px) {
    p {
        font-size: 1rem;
    }
}
</style>
