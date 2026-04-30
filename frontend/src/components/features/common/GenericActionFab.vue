<template>
    <div
        class="generic-action-fab"
        :class="{ dragging }"
        :style="fabStyle"
        @pointerdown="onPointerDown"
    >
        <v-fab
            :color="isOpen ? '' : 'var(--accent-green)'"
            :absolute="true"
            size="large"
            icon
            class="generic-main-fab"
            @click="onFabClick"
        >
            <FontAwesomeIcon :icon="isOpen ? faXmark : faPlus" />
            <v-speed-dial
                v-model="isOpen"
                location="top"
                transition="slide-y-reverse-transition"
                activator="parent"
                class="generic-speed-dial"
            >
                <v-btn
                    v-for="action in actions"
                    :key="action.id"
                    :title="action.title"
                    :color="action.color"
                    icon
                    :class="`generic-speed-dial-action generic-speed-dial-action-${action.id}`"
                    @click.stop="action.handler"
                >
                    <FontAwesomeIcon :icon="action.icon" />
                </v-btn>
            </v-speed-dial>
        </v-fab>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import type { CSSProperties } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
    faBookMedical,
    faComments,
    faPenNib,
    faPlus,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { usePalaverStore } from "@/stores/palaver";
import { useShelfModalStore } from "@/stores/shelfModal";

const props = withDefaults(
    defineProps<{
        draggable?: boolean;
    }>(),
    {
        draggable: true,
    }
);

const isOpen = ref(false);
const palaver = usePalaverStore();
const shelfModalStore = useShelfModalStore();
const router = useRouter();
const { mobile } = useDisplay();

const DESKTOP_FAB_SIZE = 64;
const MOBILE_FAB_SIZE = 56;
const EDGE_MARGIN = 4;
const DRAG_THRESHOLD_PX = 5;

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

const fabSize = computed(() =>
    mobile.value ? MOBILE_FAB_SIZE : DESKTOP_FAB_SIZE
);

const loadPosition = () => {
    if (!props.draggable) return;
    left.value = window.innerWidth - fabSize.value - EDGE_MARGIN;
    top.value = window.innerHeight - fabSize.value - EDGE_MARGIN;
};

const fabStyle = computed((): CSSProperties => {
    if (!props.draggable) {
        return {
            position: "fixed",
            bottom: `${EDGE_MARGIN}px`,
            right: `${EDGE_MARGIN}px`,
        };
    }

    return {
        position: "fixed",
        top: `${top.value}px`,
        left: `${left.value}px`,
        width: `${fabSize.value}px`,
        height: `${fabSize.value}px`,
    };
});

const onPointerMove = (event: PointerEvent) => {
    if (!dragging.value) return;

    const newLeft = startLeft + (event.clientX - startX);
    const newTop = startTop + (event.clientY - startY);
    if (
        Math.abs(event.clientX - startX) > DRAG_THRESHOLD_PX ||
        Math.abs(event.clientY - startY) > DRAG_THRESHOLD_PX
    ) {
        moved.value = true;
        isOpen.value = false;
    }

    left.value = clamp(
        newLeft,
        EDGE_MARGIN,
        window.innerWidth - fabSize.value - EDGE_MARGIN
    );
    top.value = clamp(
        newTop,
        EDGE_MARGIN,
        window.innerHeight - fabSize.value - EDGE_MARGIN
    );
};

const onPointerUp = () => {
    if (!dragging.value) return;
    dragging.value = false;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
};

const isSpeedDialAction = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    return !!target.closest(".generic-speed-dial-action");
};

const onPointerDown = (event: PointerEvent) => {
    if (
        !props.draggable ||
        event.button !== 0 ||
        isSpeedDialAction(event.target)
    ) {
        return;
    }

    dragging.value = true;
    moved.value = false;
    startX = event.clientX;
    startY = event.clientY;
    startLeft = left.value;
    startTop = top.value;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
};

const onFabClick = () => {
    if (props.draggable && (dragging.value || moved.value)) {
        setTimeout(() => {
            moved.value = false;
        }, 0);
        return;
    }

    isOpen.value = !isOpen.value;
};

const onResize = () => {
    if (!props.draggable) return;
    left.value = clamp(
        left.value,
        EDGE_MARGIN,
        window.innerWidth - fabSize.value - EDGE_MARGIN
    );
    top.value = clamp(
        top.value,
        EDGE_MARGIN,
        window.innerHeight - fabSize.value - EDGE_MARGIN
    );
};

onMounted(() => {
    loadPosition();
    if (props.draggable) {
        window.addEventListener("resize", onResize, { passive: true });
    }
});

onUnmounted(() => {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
});

const openAddBookModal = () => {
    shelfModalStore.openAddBook();
    isOpen.value = false;
};

const openPalaverModal = () => {
    palaver.openItemModal("create");
    isOpen.value = false;
};

const openProseComposer = () => {
    router.push("/prose/new");
    isOpen.value = false;
};

const actions: Array<{
    id: string;
    title: string;
    icon: typeof faBookMedical;
    color: string;
    handler: () => void;
}> = [
    {
        id: "palaver",
        title: "palaver",
        icon: faComments,
        color: "var(--accent-fuschia)",
        handler: openPalaverModal,
    },
    {
        id: "prose",
        title: "pen some pretentious prose",
        icon: faPenNib,
        color: "var(--accent-lavender)",
        handler: openProseComposer,
    },
    {
        id: "add-book",
        title: "add a book",
        icon: faBookMedical,
        color: "var(--accent-blue)",
        handler: openAddBookModal,
    },
];
</script>

<style scoped>
.generic-action-fab {
    z-index: 1000;
    touch-action: none;
}

.generic-action-fab:not(.dragging) {
    cursor: grab;
}

.generic-action-fab.dragging {
    cursor: grabbing;
}

:deep(.generic-main-fab .v-btn) {
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

:deep(.generic-main-fab .v-btn:hover) {
    background-color: var(--accent-green) !important;
    color: var(--background-color) !important;
}

:deep(.generic-main-fab svg) {
    color: var(--accent-green) !important;
    fill: var(--accent-green) !important;
}

:deep(.generic-main-fab:hover svg) {
    color: var(--background-color) !important;
    fill: var(--background-color) !important;
}

:deep(.generic-speed-dial-action) {
    border: none !important;
    font-family: "Crimson Text", serif !important;
    font-weight: 600 !important;
    font-size: 1.5rem !important;
    transition: background-color 0.3s ease !important;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5) !important;
}

:deep(.generic-speed-dial-action-add-book) {
    background-color: var(--accent-blue) !important;
    color: var(--background-color) !important;
}

:deep(.generic-speed-dial-action-add-book:hover) {
    background-color: var(--accent-fuschia) !important;
}

:deep(.generic-speed-dial-action-palaver) {
    background-color: var(--accent-fuschia) !important;
    color: var(--background-color) !important;
}

:deep(.generic-speed-dial-action-palaver:hover) {
    background-color: var(--accent-blue) !important;
}

:deep(.generic-speed-dial-action-prose) {
    background-color: var(--accent-lavender) !important;
    color: var(--background-color) !important;
}

:deep(.generic-speed-dial-action-prose:hover) {
    background-color: var(--accent-fuschia) !important;
}

:deep(.v-speed-dial__list) {
    align-items: flex-end;
    gap: 0.75rem;
}

:deep(.v-btn--size-large.v-btn--fab) {
    width: 4rem;
    height: 4rem;
    min-width: 4rem;
}

:deep(.generic-main-fab svg) {
    font-size: 2rem !important;
    width: 2rem !important;
    height: 2rem !important;
}

:deep(.generic-speed-dial-action svg) {
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

    :deep(.generic-main-fab svg) {
        font-size: 1.75rem !important;
        width: 1.75rem !important;
        height: 1.75rem !important;
    }
}
</style>
