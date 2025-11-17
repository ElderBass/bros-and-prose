<template>
    <div
        class="draggable-fab"
        :class="{ dragging }"
        :style="{ top: `${top}px`, left: `${left}px` }"
        @pointerdown="onPointerDown"
    >
        <FloatingActionButton
            :icon="faCommentMedical"
            :draggable="true"
            title="add an inbrospective comment"
            style="background-color: var(--background-color)"
            @click="onButtonClick"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";

const emit = defineEmits<{
    (e: "click"): void;
}>();

const FAB_SIZE = 64; // approximate size of the FloatingActionButton in px
const MARGIN = 16;
const DRAG_THRESHOLD_PX = 5; // movement threshold to consider as drag

const top = ref(0);
const left = ref(0);
const dragging = ref(false);
const moved = ref(false);

let startX = 0;
let startY = 0;
let startLeft = 0;
let startTop = 0;

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

const loadPosition = () => {
    // default: bottom-right with margin
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    left.value = ww - FAB_SIZE - MARGIN;
    top.value = wh - FAB_SIZE - MARGIN;
};

const onPointerMove = (e: PointerEvent) => {
    if (!dragging.value) return;
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const newLeft = startLeft + (e.clientX - startX);
    const newTop = startTop + (e.clientY - startY);
    if (
        Math.abs(e.clientX - startX) > DRAG_THRESHOLD_PX ||
        Math.abs(e.clientY - startY) > DRAG_THRESHOLD_PX
    ) {
        moved.value = true;
    }
    left.value = clamp(newLeft, MARGIN, ww - FAB_SIZE - MARGIN);
    top.value = clamp(newTop, MARGIN, wh - FAB_SIZE - MARGIN);
};

const onPointerUp = () => {
    if (!dragging.value) return;
    dragging.value = false;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
};

const onPointerDown = (e: PointerEvent) => {
    // Avoid right-click drags
    if (e.button !== 0) return;
    dragging.value = true;
    moved.value = false;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = left.value;
    startTop = top.value;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
};

const onButtonClick = () => {
    // Swallow click if this interaction was a drag
    if (dragging.value || moved.value) {
        // reset moved after click cycle
        setTimeout(() => {
            moved.value = false;
        }, 0);
        return;
    }
    emit("click");
};

const onResize = () => {
    // Re-clamp inside viewport on resize/rotation
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    left.value = clamp(left.value, MARGIN, ww - FAB_SIZE - MARGIN);
    top.value = clamp(top.value, MARGIN, wh - FAB_SIZE - MARGIN);
};

onMounted(() => {
    loadPosition();
    window.addEventListener("resize", onResize, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
});
</script>

<style scoped>
.draggable-fab {
    position: fixed;
    z-index: 100;
    touch-action: none; /* allow dragging without scroll interference */
    cursor: grab;
}
.draggable-fab.dragging {
    cursor: grabbing;
}
</style>
