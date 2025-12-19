<template>
    <div
        class="base-carousel"
        :class="{ hovering: isHovering }"
        :style="containerStyle"
        tabindex="0"
        role="region"
        aria-roledescription="carousel"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
        @keydown.left.prevent="prev"
        @keydown.right.prevent="next"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="resetPointer"
    >
        <div class="row">
            <div v-if="showArrowsResolved && items.length > 1" class="nav-col">
                <IconButton
                    :icon="faChevronLeft"
                    :size="buttonSize"
                    color="blue"
                    title="previous"
                    :handleClick="prev"
                />
            </div>

            <div class="viewport">
                <Transition :name="transitionName" mode="out-in">
                    <div
                        v-if="items.length"
                        :key="activeIndex"
                        class="slide"
                        role="group"
                        :aria-label="`slide ${activeIndex + 1} of ${items.length}`"
                    >
                        <slot
                            name="item"
                            :item="items[activeIndex]"
                            :index="activeIndex"
                        >
                            <!-- Fallback: if no item slot provided, render default slot -->
                            <slot
                                :item="items[activeIndex]"
                                :index="activeIndex"
                            />
                        </slot>
                    </div>
                    <div v-else key="empty" class="empty">
                        <slot name="empty" />
                    </div>
                </Transition>
            </div>

            <div v-if="showArrowsResolved && items.length > 1" class="nav-col">
                <IconButton
                    :icon="faChevronRight"
                    :size="buttonSize"
                    color="blue"
                    title="next"
                    :handleClick="next"
                />
            </div>
        </div>

        <div v-if="showDelimiters && items.length > 1" class="delimiters">
            <button
                v-for="(_, idx) in items"
                :key="idx"
                type="button"
                class="dot"
                :class="{ active: idx === activeIndex }"
                :aria-label="`go to slide ${idx + 1}`"
                @click="goTo(idx)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import IconButton from "@/components/ui/IconButton.vue";
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import type { ButtonSize } from "@/types";
import { useDisplay } from "vuetify";

type ShowArrows = boolean | "hover";

const props = withDefaults(
    defineProps<{
        items?: unknown[];
        modelValue?: number;
        cycle?: boolean;
        intervalMs?: number;
        showArrows?: ShowArrows;
        showDelimiters?: boolean;
        height?: string | number;
        accentColor?: "blue" | "fuschia" | "green" | "lavender" | "red";
    }>(),
    {
        items: () => [],
        modelValue: undefined,
        cycle: true,
        intervalMs: 6000,
        showArrows: "hover",
        showDelimiters: true,
        height: "auto",
        accentColor: "blue",
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: number): void;
    (e: "change", value: number): void;
}>();

const { mobile } = useDisplay();

const items = computed(() => (props.items || []).filter(Boolean));

const isHovering = ref(false);
const internalIndex = ref(0);
const direction = ref<"next" | "prev">("next");

const activeIndex = computed(() => {
    const len = items.value.length || 1;
    const val = props.modelValue ?? internalIndex.value;
    const safe = ((val % len) + len) % len;
    return Number.isFinite(safe) ? safe : 0;
});

const showArrowsResolved = computed(() => {
    if (props.showArrows === "hover") return isHovering.value;
    return !!props.showArrows;
});

const transitionName = computed(() =>
    direction.value === "next" ? "slide-next" : "slide-prev"
);

const containerStyle = computed(() => {
    const height =
        typeof props.height === "number" ? `${props.height}px` : props.height;
    return { height };
});

const buttonSize = computed<ButtonSize>(() => {
    return mobile.value ? "xsmall" : "small";
});

const setIndex = (idx: number) => {
    const len = items.value.length;
    if (!len) return;
    const safe = ((idx % len) + len) % len;
    internalIndex.value = safe;
    emit("update:modelValue", safe);
    emit("change", safe);
};

const next = () => {
    direction.value = "next";
    setIndex(activeIndex.value + 1);
};

const prev = () => {
    direction.value = "prev";
    setIndex(activeIndex.value - 1);
};

const goTo = (idx: number) => {
    direction.value = idx > activeIndex.value ? "next" : "prev";
    setIndex(idx);
};

// Auto-rotate
let timer: number | null = null;
const clearTimer = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
};

const startTimer = () => {
    clearTimer();
    if (!props.cycle) return;
    if (items.value.length < 2) return;
    timer = window.setInterval(() => {
        if (isHovering.value) return;
        next();
    }, props.intervalMs);
};

watch(
    () => [props.cycle, props.intervalMs, items.value.length],
    () => startTimer()
);

onMounted(() => startTimer());
onBeforeUnmount(() => clearTimer());

// Swipe support (simple)
const pointerStartX = ref<number | null>(null);
const onPointerDown = (e: PointerEvent) => {
    pointerStartX.value = e.clientX;
};
const onPointerUp = (e: PointerEvent) => {
    if (pointerStartX.value === null) return;
    const dx = e.clientX - pointerStartX.value;
    pointerStartX.value = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) next();
    else prev();
};
const resetPointer = () => {
    pointerStartX.value = null;
};
</script>

<style scoped>
.base-carousel {
    position: relative;
    width: 100%;
    outline: none;
}

.row {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    align-items: center; /* vertically center nav buttons with slide content */
    gap: 0.5rem;
    width: 100%;
}

.nav-col {
    display: flex;
    align-items: center;
    justify-content: center;
}

.viewport {
    width: 100%;
    overflow: hidden;
}

.slide {
    width: 100%;
}

.delimiters {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 0 0;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    border: 2px solid var(--accent-blue);
    background: transparent;
    opacity: 0.9;
    cursor: pointer;
    transition:
        transform 0.15s ease,
        background-color 0.15s ease,
        border-color 0.15s ease;
}

.dot.active {
    background: var(--accent-fuschia);
    border-color: var(--accent-fuschia);
    transform: scale(1.05);
    opacity: 1;
}

.base-carousel:focus-visible {
    outline: 2px solid var(--accent-blue);
    outline-offset: 6px;
    border-radius: 1rem;
}

/* Slide transitions */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
    transition:
        transform 0.22s ease,
        opacity 0.22s ease;
}

.slide-next-enter-from {
    transform: translateX(18px);
    opacity: 0;
}
.slide-next-leave-to {
    transform: translateX(-18px);
    opacity: 0;
}

.slide-prev-enter-from {
    transform: translateX(-18px);
    opacity: 0;
}
.slide-prev-leave-to {
    transform: translateX(18px);
    opacity: 0;
}

@media (max-width: 768px) {
    .delimiters {
        padding-top: 0.9rem;
    }

    .row {
        gap: 0.35rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
