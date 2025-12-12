<template>
    <v-infinite-scroll
        class="infinite-scroll"
        :class="{ column: direction === 'vertical' }"
        :direction="direction"
        :height="height"
        :mode="mode"
        @load="handleLoad"
    >
        <slot />

        <template #loading>
            <slot name="loading">
                <div class="default-loader">
                    <span>loading more bullshit…</span>
                </div>
            </slot>
        </template>
    </v-infinite-scroll>
</template>

<script setup lang="ts">
import type { VInfiniteScroll } from "vuetify/components";

type InfiniteScrollLoadEvent = Parameters<
    NonNullable<InstanceType<typeof VInfiniteScroll>["$props"]["onLoad"]>
>[0];

withDefaults(
    defineProps<{
        direction?: "vertical" | "horizontal";
        height?: string | number;
        mode?: NonNullable<VInfiniteScroll["$props"]["mode"]>;
    }>(),
    {
        direction: "vertical",
        height: "100%",
        mode: "intersect",
    }
);

const emit = defineEmits<{
    (e: "load", payload: InfiniteScrollLoadEvent): void;
}>();

const handleLoad = (event: InfiniteScrollLoadEvent) => {
    emit("load", event);
};
</script>

<style scoped>
.infinite-scroll {
    width: 100%;
    display: flex;
    gap: 0.5rem;
}

.column {
    flex-direction: column;
}

.default-loader {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    font-size: 0.95rem;
    text-transform: lowercase;
    color: var(--accent-blue);
    opacity: 0.75;
}

:deep(.v-infinite-scroll__side) {
    display: none;
}

:deep(.v-infinite-scroll) {
    background-color: transparent !important;
    box-shadow: none !important;
}

:deep(.v-infinite-scroll--horizontal),
:deep(.v-infinite-scroll--vertical),
:deep(.v-infinite-scroll--end) {
    background-color: transparent !important;
    box-shadow: none !important;
}

:deep(.v-infinite-scroll::before),
:deep(.v-infinite-scroll::after) {
    display: none !important;
}
</style>
