<template>
    <BaseModal
        :modelValue="open"
        @close="handleClose"
        title="upload your mug, bro"
        size="medium"
    >
        <div class="upload-container">
            <!-- Hidden file input -->
            <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png"
                @change="onFileSelect"
                style="display: none"
            />

            <!-- Dropzone (before file selected) -->
            <div
                v-if="!selectedFile"
                class="dropzone"
                @click="triggerFilePicker"
            >
                <FontAwesomeIcon :icon="faCloudUpload" class="upload-icon" />
                <p class="main-text">click to select an image</p>
                <p class="hint-text">JPG or PNG, max 5MB</p>
            </div>

            <!-- Preview (after file selected) -->
            <div v-else class="preview-container">
                <img :src="previewUrl" alt="Preview" class="preview-image" />
                <p class="file-name">{{ selectedFile.name }}</p>
                <div class="actions">
                    <BaseButton
                        variant="outline-secondary"
                        @click="clearSelection"
                        v-bind="buttonProps"
                    >
                        choose different
                    </BaseButton>
                    <BaseButton
                        variant="outline"
                        @click="proceedToCrop"
                        v-bind="buttonProps"
                    >
                        position it
                    </BaseButton>
                </div>
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useDisplay } from "vuetify";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";
import { validateAvatarFile } from "@/utils/avatarValidation";
import { useUIStore } from "@/stores/ui";
import { QUICK_ERROR } from "@/constants";

const emit = defineEmits<{
    (e: "close"): void;
    (e: "file-selected", file: File): void;
}>();

const props = defineProps<{
    open: boolean;
}>();

const { mobile } = useDisplay();
const { showAlert } = useUIStore();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref("");

const buttonProps = computed(() => ({
    size: mobile.value ? "small" : "medium",
}));

const triggerFilePicker = () => {
    fileInput.value?.click();
};

const onFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    // Validate file
    const validation = validateAvatarFile(file);
    if (!validation.valid) {
        showAlert(QUICK_ERROR([validation.error || "Invalid file!"]));
        return;
    }

    // Set selected file and create preview
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
};

const clearSelection = () => {
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
    }
    selectedFile.value = null;
    previewUrl.value = "";
    if (fileInput.value) {
        fileInput.value.value = "";
    }
};

const proceedToCrop = () => {
    if (selectedFile.value) {
        emit("file-selected", selectedFile.value);
    }
};

const handleClose = () => {
    clearSelection();
    emit("close");
};

// Clean up preview URL when modal closes
watch(
    () => props.open,
    (isOpen) => {
        if (!isOpen) {
            clearSelection();
        }
    }
);
</script>

<style scoped>
.upload-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
}

.dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 3rem 2rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(0, 0, 0, 0.2);
}

.dropzone:hover {
    border-color: var(--accent-fuschia);
    border-style: solid;
    box-shadow:
        0 4px 20px var(--accent-fuschia),
        0 0 40px var(--accent-fuschia),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transform: scale(1.02);
    background: rgba(0, 0, 0, 0.4);
}

.upload-icon {
    font-size: 4rem;
    color: var(--accent-blue);
    transition: color 0.3s ease;
}

.dropzone:hover .upload-icon {
    color: var(--accent-fuschia);
}

.main-text {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
}

.hint-text {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin: 0;
    font-style: italic;
}

.preview-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
}

.preview-image {
    max-width: 100%;
    max-height: 300px;
    border-radius: 0.5rem;
    border: 2px solid var(--accent-blue);
}

.file-name {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin: 0;
    text-align: center;
    word-break: break-all;
}

.actions {
    display: flex;
    gap: 0.75rem;
    width: 100%;
    justify-content: center;
}

@media (max-width: 768px) {
    .dropzone {
        padding: 2rem 1rem;
    }

    .upload-icon {
        font-size: 3rem;
    }

    .main-text {
        font-size: 1rem;
    }

    .actions {
        flex-direction: column;
    }
}
</style>
