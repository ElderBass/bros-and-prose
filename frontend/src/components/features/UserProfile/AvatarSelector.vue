<template>
    <div class="avatar-selector">
        <AvatarSelectionItem
            v-for="item in selectableIcons"
            :key="item.name"
            :icon="item.icon"
            :friendlyName="item.friendlyName"
            :isSelected="modelValue === item.icon.iconName"
            @update:avatar="onSelect"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AvatarSelectionItem from "@/components/features/UserProfile/AvatarSelectionItem.vue";
import { avatarIcons } from "@/constants";

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const props = defineProps<{
    modelValue: string;
    currentAvatar: string;
}>();

const onSelect = (iconName: string) => {
    emit("update:modelValue", iconName);
};

const selectableIcons = computed(() => {
    return avatarIcons.filter(
        (icon) => icon.icon.iconName !== props.currentAvatar
    );
});
</script>

<style scoped>
.avatar-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    width: 100%;
    padding: 1rem 0;
    /* height: 100%; */
    justify-content: center;
    align-items: center;
}
</style>
