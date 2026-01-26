<template>
    <div class="avatar-selector">
        <!-- Upload custom option -->
        <div class="upload-custom-option" @click="handleUploadClick">
            <div class="upload-icon-container">
                <FontAwesomeIcon :icon="faCloudUpload" />
            </div>
            <p>upload custom</p>
        </div>

        <!-- Existing icon options -->
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";
import AvatarSelectionItem from "@/components/features/UserProfile/AvatarSelectionItem.vue";
import { avatarIcons } from "@/constants";

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "upload-click"): void;
}>();

const props = defineProps<{
    modelValue: string;
    currentAvatar: string;
}>();

const onSelect = (iconName: string) => {
    emit("update:modelValue", iconName);
};

const handleUploadClick = () => {
    emit("upload-click");
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
    justify-content: center;
    align-items: center;
}

.upload-custom-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px dashed var(--accent-blue);
    border-radius: 1rem;
    padding: 1rem;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 128px;
}

.upload-custom-option:hover {
    border-color: var(--accent-fuschia);
    border-style: solid;
    box-shadow:
        0 4px 20px var(--accent-fuschia),
        0 0 40px var(--accent-fuschia),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
}

.upload-icon-container {
    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: var(--accent-blue);
    transition: color 0.3s ease;
}

.upload-custom-option:hover .upload-icon-container {
    color: var(--accent-fuschia);
}

.upload-custom-option p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-color);
    font-weight: 500;
}

@media (min-width: 768px) {
    .upload-custom-option p {
        font-size: 1.25rem;
    }
    .upload-custom-option {
        min-width: 164px;
        height: 200px;
    }
    .upload-icon-container {
        font-size: 2.5rem;
    }
}
</style>
