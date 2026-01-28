<template>
    <BaseModal
        :modelValue="open"
        @close="handleClose"
        title="position your pic"
        size="large"
    >
        <div class="crop-container">
            <!-- Image with circular overlay -->
            <div class="crop-frame" ref="frameRef">
                <img
                    ref="imageRef"
                    :src="imageSrc"
                    :style="imageStyle"
                    @mousedown="startDrag"
                    @touchstart="startDrag"
                    class="draggable-image"
                    draggable="false"
                    @load="onImageLoad"
                />
                <div class="circle-overlay"></div>
            </div>

            <!-- Zoom controls -->
            <div class="controls">
                <IconButton
                    :icon="faMinus"
                    :handleClick="zoomOut"
                    :disabled="scale <= minScale"
                    title="zoom back"
                    size="small"
                    variant="outline"
                />
                <span class="zoom-display">{{ Math.round(scale * 100) }}%</span>
                <IconButton
                    :icon="faPlus"
                    :handleClick="zoomIn"
                    :disabled="scale >= maxScale"
                    title="close up"
                    size="small"
                    variant="outline"
                />
            </div>

            <p class="hint">drag to reposition, use +/- to zoom</p>

            <div class="modal-actions">
                <BaseButton
                    variant="outline-secondary"
                    @click="handleClose"
                    v-bind="buttonProps"
                >
                    cancel
                </BaseButton>
                <BaseButton
                    variant="outline"
                    @click="handleConfirm"
                    :disabled="isProcessing"
                    v-bind="buttonProps"
                >
                    {{ isProcessing ? "processing..." : "looks good" }}
                </BaseButton>
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from "vue";
import { useDisplay } from "vuetify";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const emit = defineEmits<{
    (e: "close"): void;
    (e: "confirm", blob: Blob): void;
}>();

const props = defineProps<{
    open: boolean;
    imageSrc: string;
}>();

const { mobile } = useDisplay();

const frameRef = ref<HTMLDivElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);
const position = ref({ x: 0, y: 0 });
const scale = ref(1);
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const isProcessing = ref(false);
const imageLoaded = ref(false);

const minScale = 0.25;
const maxScale = 3;
const scaleStep = 0.05;

const buttonProps = computed(() => ({
    size: mobile.value ? "small" : "medium",
}));

const imageStyle = computed(() => ({
    top: `${position.value.y}px`,
    left: `${position.value.x}px`,
    transform: `scale(${scale.value})`,
    transformOrigin: "top left",
    cursor: isDragging.value ? "grabbing" : "grab",
}));

const onImageLoad = () => {
    imageLoaded.value = true;
    // Center the image initially
    if (imageRef.value && frameRef.value) {
        const img = imageRef.value;
        const frame = frameRef.value;

        // Calculate scale to fit image in frame
        const scaleX = frame.offsetWidth / img.naturalWidth;
        const scaleY = frame.offsetHeight / img.naturalHeight;
        const initialScale = Math.max(scaleX, scaleY);

        scale.value = Math.max(minScale, Math.min(maxScale, initialScale));
    }
};

const startDrag = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    isDragging.value = true;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    dragStart.value = {
        x: clientX - position.value.x,
        y: clientY - position.value.y,
    };

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchmove", handleDrag);
    document.addEventListener("touchend", endDrag);
};

const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    position.value = {
        x: clientX - dragStart.value.x,
        y: clientY - dragStart.value.y,
    };
};

const endDrag = () => {
    isDragging.value = false;
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchmove", handleDrag);
    document.removeEventListener("touchend", endDrag);
};

const zoomIn = () => {
    scale.value = Math.min(scale.value + scaleStep, maxScale);
};

const zoomOut = () => {
    scale.value = Math.max(scale.value - scaleStep, minScale);
};

const cropImage = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        if (!imageRef.value || !frameRef.value) {
            reject(new Error("Image or frame not found"));
            return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
        }

        // Set canvas to circular crop size
        const size = 500;
        canvas.width = size;
        canvas.height = size;

        const img = imageRef.value;
        const frame = frameRef.value;

        // Calculate the portion of the image to draw
        const frameWidth = frame.offsetWidth;
        const frameHeight = frame.offsetHeight;

        // Calculate source coordinates (which part of image to use)
        const sourceX =
            (frameWidth / 2 - position.value.x) / scale.value -
            img.naturalWidth / 2;
        const sourceY =
            (frameHeight / 2 - position.value.y) / scale.value -
            img.naturalHeight / 2;
        const sourceWidth = frameWidth / scale.value;
        const sourceHeight = frameHeight / scale.value;

        // Draw the image portion to canvas
        ctx.drawImage(
            img,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            size,
            size
        );

        // Convert to blob
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Failed to create blob"));
                }
            },
            "image/jpeg",
            0.9
        );
    });
};

const handleConfirm = async () => {
    try {
        isProcessing.value = true;
        const blob = await cropImage();
        emit("confirm", blob);
    } catch (error) {
        console.error("Error cropping image:", error);
    } finally {
        isProcessing.value = false;
    }
};

const handleClose = () => {
    resetState();
    emit("close");
};

const resetState = () => {
    position.value = { x: 0, y: 0 };
    scale.value = 1;
    isDragging.value = false;
    imageLoaded.value = false;
};

// Clean up event listeners on unmount
onUnmounted(() => {
    endDrag();
});

// Reset state when modal closes
watch(
    () => props.open,
    (isOpen) => {
        if (!isOpen) {
            resetState();
        }
    }
);
</script>

<style scoped>
.crop-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem 0;
}

.crop-frame {
    position: relative;
    width: 500px;
    height: 500px;
    margin: 0 auto;
    overflow: hidden;
    border: 2px solid var(--accent-blue);
    border-radius: 0.75rem;
    background: rgba(0, 0, 0, 0.9);
}

.draggable-image {
    position: absolute;
    top: 0;
    left: 0;
    user-select: none;
    -webkit-user-drag: none;
    max-width: none;
    transition: transform 0.1s ease-out;
}

.circle-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
    pointer-events: none;
    border: 2px dashed var(--accent-fuschia);
}

.controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.zoom-display {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color);
    min-width: 4rem;
    text-align: center;
}

.hint {
    font-size: 0.875rem;
    color: var(--text-muted);
    text-align: center;
    margin: 0;
    font-style: italic;
}

.modal-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    width: 100%;
}

@media (max-width: 768px) {
    .crop-frame {
        width: 300px;
        height: 300px;
    }

    .controls {
        gap: 0.75rem;
    }

    .zoom-display {
        font-size: 0.875rem;
        min-width: 3rem;
    }

    .modal-actions {
        flex-direction: column;
    }
}
</style>
