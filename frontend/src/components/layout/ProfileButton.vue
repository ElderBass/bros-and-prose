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
                <AvatarImage
                    :avatar="avatar"
                    :avatarType="avatarType"
                    size="medium"
                />
            </button>
        </template>
    </BaseTooltip>
</template>

<script setup lang="ts">
import AvatarImage from "@/components/ui/AvatarImage.vue";

defineProps<{
    avatar: string;
    avatarType: "icon" | "image";
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
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s ease;
}

.user-actions:hover {
    background-color: rgba(77, 77, 255, 0.1);
    transform: scale(1.1);
}

.user-actions:active {
    transform: scale(1.05);
}

.user-actions:focus {
    outline: 2px solid var(--accent-blue);
    outline-offset: 2px;
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
