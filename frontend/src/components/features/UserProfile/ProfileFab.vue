<template>
    <div
        class="draggable-fab"
        :class="{ dragging }"
        :style="fabStyle"
        @pointerdown="onPointerDown"
    >
        <v-fab
            :color="isOpen ? '' : 'var(--accent-green)'"
            :absolute="true"
            size="large"
            icon
            class="profile-main-fab"
            @click="onFabClick"
        >
            <FontAwesomeIcon :icon="isOpen ? faXmark : faPlus" />
            <v-speed-dial
                v-model="isOpen"
                :location="menuLocation"
                :transition="transition"
                activator="parent"
                class="profile-speed-dial"
            >
                <v-btn
                    v-for="action in actions"
                    :key="action.id"
                    :title="action.title"
                    :color="action.color"
                    icon
                    :class="`profile-speed-dial-action profile-speed-dial-action-${action.id}`"
                    @click="action.handler"
                >
                    <FontAwesomeIcon :icon="action.icon" />
                </v-btn>
            </v-speed-dial>
        </v-fab>
    </div>

    <ShelfModals />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { CSSProperties } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
    faBookMedical,
    faComments,
    faPlus,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import ShelfModals from "@/components/features/UserProfile/Shelves/ShelfModals/index.vue";
import { usePalaverStore } from "@/stores/palaver";
import { useShelfModalStore } from "@/stores/shelfModal";

const props = withDefaults(
    defineProps<{
        draggable?: boolean;
    }>(),
    {
        draggable: false,
    }
);

const isOpen = ref(false);
const palaver = usePalaverStore();

const menuLocation = "top";
const transition = "slide-y-reverse-transition";

// Draggable state
const FAB_SIZE = 64; // approximate size of the FAB in px
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
    if (props.draggable) {
        // default: bottom-right with 1rem margin (matching FloatingActionButton)
        // FloatingActionButton uses bottom: 1rem, right: 1rem (16px)
        const ww = window.innerWidth;
        const wh = window.innerHeight;
        const rightMargin = 16; // 1rem
        const bottomMargin = 16; // 1rem
        left.value = ww - FAB_SIZE - rightMargin;
        top.value = wh - FAB_SIZE - bottomMargin;
    }
};

const fabStyle = computed((): CSSProperties => {
    if (props.draggable) {
        return {
            position: "fixed",
            top: `${top.value}px`,
            left: `${left.value}px`,
        };
    }
    // When not draggable, match FloatingActionButton default position
    return {
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
    };
});

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
    if (!props.draggable) return;
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

const onFabClick = () => {
    // Swallow click if this interaction was a drag
    if (props.draggable && (dragging.value || moved.value)) {
        // reset moved after click cycle
        setTimeout(() => {
            moved.value = false;
        }, 0);
        return;
    }
    isOpen.value = !isOpen.value;
};

const onResize = () => {
    if (!props.draggable) return;
    // Re-clamp inside viewport on resize/rotation
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    left.value = clamp(left.value, MARGIN, ww - FAB_SIZE - MARGIN);
    top.value = clamp(top.value, MARGIN, wh - FAB_SIZE - MARGIN);
};

onMounted(() => {
    if (props.draggable) {
        loadPosition();
        window.addEventListener("resize", onResize, { passive: true });
    }
});

onUnmounted(() => {
    if (props.draggable) {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
    }
});

const openAddBookModal = () => {
    useShelfModalStore().openAddBook();
    isOpen.value = false;
};

const openPalaverModal = () => {
    palaver.openItemModal("create");
    isOpen.value = false;
};

type ShadowColor = "lavender" | "fuschia" | "green" | "blue";

const actions: Array<{
    id: string;
    title: string;
    icon: typeof faBookMedical;
    color: string;
    tooltipColor: ShadowColor;
    handler: () => void;
}> = [
    {
        id: "palaver",
        title: "palaver",
        icon: faComments,
        color: "var(--accent-fuschia)",
        tooltipColor: "fuschia",
        handler: openPalaverModal,
    },
    {
        id: "add-book",
        title: "add a book",
        icon: faBookMedical,
        color: "var(--accent-blue)",
        tooltipColor: "blue",
        handler: openAddBookModal,
    },
];
</script>

<style scoped>
.draggable-fab {
    z-index: 1000;
    touch-action: none; /* allow dragging without scroll interference */
}

.draggable-fab:not(.dragging) {
    cursor: default;
}

.draggable-fab.dragging {
    cursor: grabbing;
}

/* Main FAB - outline variant with green border and icon */
:deep(.profile-main-fab .v-btn) {
    background-color: var(--background-color) !important;
    color: var(--accent-green) !important;
    border: 2px solid var(--accent-green) !important;
    font-family: "Crimson Text", serif !important;
    font-weight: 600 !important;
    transition:
        background-color 0.3s ease,
        border-color 0.3s ease !important;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5) !important;
    cursor: pointer;
}

:deep(.profile-main-fab .v-btn:hover) {
    background-color: var(--accent-green) !important;
    color: var(--background-color) !important;
}

:deep(.profile-main-fab svg) {
    color: var(--accent-green) !important;
    fill: var(--accent-green) !important;
}

:deep(.profile-main-fab:hover svg) {
    color: var(--background-color) !important;
    fill: var(--background-color) !important;
}

/* Speed dial action buttons - match BaseButton variants */
:deep(.profile-speed-dial-action) {
    border: none !important;
    font-family: "Crimson Text", serif !important;
    font-weight: 600 !important;
    font-size: 1.5rem !important;
    transition: background-color 0.3s ease !important;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5) !important;
}

.v-btn--size-small {
    font-size: 1.25rem !important;
}

:deep(.profile-speed-dial-action-add-book) {
    background-color: var(--accent-blue) !important;
    color: var(--background-color) !important;
}

:deep(.profile-speed-dial-action-add-book:hover) {
    background-color: var(--accent-fuschia) !important;
}

:deep(.profile-speed-dial-action-palaver) {
    background-color: var(--accent-fuschia) !important;
    color: var(--background-color) !important;
}

:deep(.profile-speed-dial-action-palaver:hover) {
    background-color: var(--accent-blue) !important;
}

/* Speed dial list styling */
:deep(.v-speed-dial__list) {
    align-items: flex-end;
    gap: 0.75rem;
}

/* FAB sizing - match IconButton large size */
:deep(.v-btn--size-large.v-btn--fab) {
    width: 4rem;
    height: 4rem;
    min-width: 4rem;
}

/* Icon sizing for main FAB */
:deep(.profile-main-fab svg) {
    font-size: 2rem !important;
    width: 2rem !important;
    height: 2rem !important;
}

/* Icon sizing for action buttons */
:deep(.profile-speed-dial-action svg) {
    font-size: 1.5rem !important;
    width: 1.5rem !important;
    height: 1.5rem !important;
}

@media (max-width: 768px) {
    :deep(.v-btn--size-large.v-btn--fab) {
        width: 3.5rem;
        height: 3.5rem;
        min-width: 3.5rem;
    }

    :deep(.profile-main-fab svg) {
        font-size: 1.75rem !important;
        width: 1.75rem !important;
        height: 1.75rem !important;
    }

    :deep(.profile-speed-dial-action svg) {
        font-size: 1.5rem !important;
        width: 1.5rem !important;
        height: 1.5rem !important;
    }
}
</style>
