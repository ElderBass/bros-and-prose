<template>
    <div
        v-if="users.length > 0"
        class="user-mention-dropdown"
        :style="{
            top: `${position.top}px`,
            left: `${position.left}px`,
        }"
    >
        <div
            v-for="(user, index) in users"
            :key="user.id"
            class="dropdown-item"
            :class="{ selected: index === selectedIndex }"
            @mousedown.prevent="handleSelect(user)"
            @mouseenter="handleHover(index)"
        >
            <AvatarImage
                :avatar="user.avatar"
                :avatarType="user.avatarType || 'icon'"
                size="xsmall"
            />
            <div class="user-info">
                <span class="username">@{{ user.username }}</span>
                <span class="fullname"
                    >{{ user.firstName }} {{ user.lastName }}</span
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { User } from "@/types";
import AvatarImage from "./AvatarImage.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

defineProps<{
    selectedIndex: number;
    position: { top: number; left: number };
}>();

const emit = defineEmits<{
    (e: "select", user: User): void;
    (e: "hover", index: number): void;
}>();

const { allUsersExceptCurrent: users } = storeToRefs(useUserStore());

const handleSelect = (user: User) => {
    emit("select", user);
};

const handleHover = (index: number) => {
    emit("hover", index);
};
</script>

<style scoped>
.user-mention-dropdown {
    position: absolute;
    background: var(--background-color);
    border: 2px solid var(--accent-blue);
    border-radius: 0.5rem;
    box-shadow:
        0 4px 20px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.05);
    z-index: 1001;
    max-height: 200px;
    overflow-y: auto;
    min-width: 250px;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.875rem;
    cursor: pointer;
    transition: background-color 0.15s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.dropdown-item:last-child {
    border-bottom: none;
}

.dropdown-item:hover,
.dropdown-item.selected {
    background: color-mix(in srgb, var(--accent-blue) 15%, transparent);
}

.user-info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    flex: 1;
    min-width: 0;
}

.username {
    font-weight: 600;
    font-size: 1rem;
    color: var(--accent-fuschia);
}

.fullname {
    font-size: 0.85rem;
    opacity: 0.75;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Custom scrollbar styling */
.user-mention-dropdown::-webkit-scrollbar {
    width: 8px;
}

.user-mention-dropdown::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 0 0.5rem 0.5rem 0;
}

.user-mention-dropdown::-webkit-scrollbar-thumb {
    background: var(--accent-blue);
    border-radius: 4px;
}

.user-mention-dropdown::-webkit-scrollbar-thumb:hover {
    background: var(--accent-lavender);
}
</style>
