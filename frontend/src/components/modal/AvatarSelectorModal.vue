<template>
    <BaseModal
        :modelValue="open"
        @close="onClose"
        title="pick ur vibe, bro"
        size="large"
    >
        <div class="modal-content">
            <!-- Loading state -->
            <LoadingSpinnerContainer
                v-if="isUploading"
                size="medium"
                message="uploading your face..."
            />

            <!-- Normal selector (not uploading) -->
            <div v-else class="selector-container">
                <AvatarSelector
                    v-model="localAvatar"
                    :currentAvatar="currentAvatar"
                    @upload-click="handleUploadClick"
                />
            </div>

            <div class="actions">
                <BaseButton
                    variant="outline-secondary"
                    @click="onClose"
                    v-bind="buttonProps"
                    >cancel</BaseButton
                >
                <BaseButton
                    variant="outline"
                    @click="onConfirm"
                    :disabled="
                        !localAvatar ||
                        localAvatar === currentAvatar ||
                        isUploading
                    "
                    v-bind="buttonProps"
                    >update</BaseButton
                >
            </div>
        </div>
    </BaseModal>

    <!-- Image Upload Modal -->
    <ImageUploadModal
        :open="showUploadModal"
        @close="showUploadModal = false"
        @file-selected="handleFileSelected"
    />

    <!-- Image Crop Modal -->
    <ImageCropModal
        :open="showCropModal"
        :imageSrc="uploadPreviewUrl"
        @close="handleCropClose"
        @confirm="handleCropConfirm"
    />
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useDisplay } from "vuetify";
import AvatarSelector from "@/components/features/UserProfile/AvatarSelector.vue";
import ImageUploadModal from "@/components/modal/ImageUploadModal.vue";
import ImageCropModal from "@/components/modal/ImageCropModal.vue";
import { useAvatar } from "@/composables/useAvatar";
import { useUserStore } from "@/stores/user";
import {
    createImagePreview,
    revokeImagePreview,
} from "@/utils/avatarValidation";

const emit = defineEmits<{
    (e: "close"): void;
    (e: "confirm", value: string): void;
}>();

const props = defineProps<{
    open: boolean;
    currentAvatar: string;
}>();

const { mobile } = useDisplay();
const { uploadAvatar } = useAvatar();
const { loggedInUser } = useUserStore();

const localAvatar = ref(props.currentAvatar);
const showUploadModal = ref(false);
const showCropModal = ref(false);
const uploadPreviewUrl = ref("");
const selectedFile = ref<File | null>(null);
const isUploading = ref(false);

const buttonProps = computed(() => {
    return {
        size: mobile.value ? "small" : "medium",
        style: { width: mobile.value ? "100%" : "75%" },
    };
});

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            localAvatar.value = props.currentAvatar;
        }
    }
);

const handleUploadClick = () => {
    showUploadModal.value = true;
};

const handleFileSelected = (file: File) => {
    selectedFile.value = file;
    uploadPreviewUrl.value = createImagePreview(file);
    showUploadModal.value = false;
    showCropModal.value = true;
};

const handleCropClose = () => {
    showCropModal.value = false;
    if (uploadPreviewUrl.value) {
        revokeImagePreview(uploadPreviewUrl.value);
        uploadPreviewUrl.value = "";
    }
    selectedFile.value = null;
};

const handleCropConfirm = async (croppedBlob: Blob) => {
    try {
        isUploading.value = true;
        showCropModal.value = false;

        // Convert blob to file
        const croppedFile = new File(
            [croppedBlob],
            selectedFile.value?.name || "avatar.jpg",
            { type: "image/jpeg" }
        );

        // Upload via composable
        await uploadAvatar(loggedInUser.id, croppedFile);

        // Clean up
        if (uploadPreviewUrl.value) {
            revokeImagePreview(uploadPreviewUrl.value);
        }

        // Close modal
        emit("close");
    } catch (error) {
        console.error("Upload failed:", error);
    } finally {
        isUploading.value = false;
        selectedFile.value = null;
        uploadPreviewUrl.value = "";
    }
};

const onClose = () => {
    // Clean up any preview URLs
    if (uploadPreviewUrl.value) {
        revokeImagePreview(uploadPreviewUrl.value);
        uploadPreviewUrl.value = "";
    }
    emit("close");
};

const onConfirm = () => emit("confirm", localAvatar.value);
</script>

<style scoped>
.modal-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.selector-container {
    max-height: 60vh;
    overflow: auto;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
    align-self: end;
    width: 75%;
}

@media (max-width: 768px) {
    .actions {
        justify-content: space-between;
        width: 100%;
        align-self: center;
    }
}
</style>
