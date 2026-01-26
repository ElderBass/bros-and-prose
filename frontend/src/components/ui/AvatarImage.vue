<template>
    <div
        class="avatar-item"
        :class="[sizeClass, { 'is-hoverable': hoverable }]"
        @click="props.onClick"
    >
        <!-- Icon Avatar -->
        <FontAwesomeIcon v-if="isIconAvatar" :icon="iconDefinition" />

        <!-- Image Avatar -->
        <img
            v-else
            :src="avatarSrc"
            :alt="altText"
            class="avatar-image"
            @error="handleImageError"
        />
    </div>
</template>

<script setup lang="ts">
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, ref } from "vue";
import { avatarIcons } from "@/constants";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";

const props = withDefaults(
    defineProps<{
        icon?: IconDefinition; // For backwards compatibility
        avatar?: string; // Avatar URL or icon name
        avatarType?: "icon" | "image";
        hoverable?: boolean;
        size?: "xsmall" | "small" | "medium" | "large" | "xlarge";
        onClick?: () => void;
    }>(),
    {
        hoverable: false,
        size: "medium",
        onClick: () => {},
        avatarType: "icon",
    }
);

const imageError = ref(false);

const isIconAvatar = computed(() => {
    // If explicit icon prop is provided (backwards compat), use it
    if (props.icon) return true;

    // If image failed to load, fallback to icon
    if (imageError.value) return true;

    // Otherwise check avatarType
    return props.avatarType === "icon" || !props.avatarType;
});

const iconDefinition = computed(() => {
    // If explicit icon prop provided, use it
    if (props.icon) return props.icon;

    // Otherwise look up icon by name from avatar prop
    if (props.avatar && isIconAvatar.value) {
        const iconConfig = avatarIcons.find(
            (config) => config.icon.iconName === props.avatar
        );
        return iconConfig?.icon ?? faUserAstronaut;
    }

    // Fallback to first icon if nothing found
    return avatarIcons[0].icon;
});

const avatarSrc = computed(() => {
    return props.avatar || "";
});

const altText = "Avatar";

const handleImageError = () => {
    console.error("Failed to load avatar image, falling back to icon");
    imageError.value = true;
};

const sizeClass = computed(() => `size-${props.size}`);
</script>

<style scoped>
.avatar-item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px solid var(--accent-blue);
    color: var(--accent-blue);
    padding: 0.5rem;
    transition: all 0.3s ease;
    background-color: transparent;
    &.is-hoverable:hover {
        cursor: pointer;
        color: var(--background-color);
        background-color: var(--accent-blue);
    }
}

.avatar-item.size-xsmall {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
}

.avatar-item.size-small {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.25rem;
}

.avatar-item.size-medium {
    width: 4rem;
    height: 4rem;
    font-size: 2rem;
}

.avatar-item.size-large {
    width: 6rem;
    height: 6rem;
    font-size: 2.75rem;
}

.avatar-item.size-xlarge {
    width: 8rem;
    height: 8rem;
    font-size: 3.5rem;
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}
</style>
