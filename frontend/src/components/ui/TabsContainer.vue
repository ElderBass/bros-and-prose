<template>
    <div class="tabs-container">
        <div v-if="headerTitle" class="tabs-header">
            <h5 class="tabs-header-title">{{ headerTitle }}</h5>
            <div class="tabs-header-buttons">
                <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    class="tab-button"
                    :class="{
                        active: modelValue === tab.id,
                        [`tab-${tab.color}`]: true,
                    }"
                    @click="updateTab(tab.id)"
                >
                    {{ tab.label }}
                </button>
            </div>
        </div>

        <div v-else class="tabs-header-no-title">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                class="tab-button"
                :class="{
                    active: modelValue === tab.id,
                    [`tab-${tab.color}`]: true,
                }"
                @click="updateTab(tab.id)"
            >
                {{ tab.label }}
            </button>
        </div>

        <div
            class="tabs-content"
            :class="[
                { 'dynamic-height': dynamicHeight },
                `content-border-${activeTabColor}`,
            ]"
        >
            <slot :name="modelValue" :activeTab="modelValue" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

export interface TabConfig {
    id: string;
    label: string;
    color: "blue" | "green" | "yellow" | "fuschia" | "lavender" | "red";
}

const props = withDefaults(
    defineProps<{
        tabs: TabConfig[];
        modelValue: string;
        headerTitle?: string;
        dynamicHeight?: boolean;
    }>(),
    {
        headerTitle: undefined,
        dynamicHeight: false,
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const activeTabColor = computed(() => {
    const tab = props.tabs.find((t) => t.id === props.modelValue);
    return tab?.color || "blue";
});

const updateTab = (tabId: string) => {
    emit("update:modelValue", tabId);
};
</script>

<style scoped>
.tabs-container {
    background: var(--background-color);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
}

/* Header with title */
.tabs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 0;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: var(--accent-blue) transparent;
    padding: 0 0.75rem;
}

.tabs-header::-webkit-scrollbar {
    height: 3px;
}

.tabs-header::-webkit-scrollbar-track {
    background: transparent;
}

.tabs-header::-webkit-scrollbar-thumb {
    background: var(--accent-blue);
    border-radius: 3px;
}

.tabs-header-title {
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 1.125rem;
    color: var(--accent-blue);
}

.tabs-header-buttons {
    display: flex;
    gap: 0.05rem;
}

/* Header without title */
.tabs-header-no-title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 0.05rem;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: var(--accent-blue) transparent;
    padding: 0 0.75rem;
}

.tabs-header-no-title::-webkit-scrollbar {
    height: 3px;
}

.tabs-header-no-title::-webkit-scrollbar-track {
    background: transparent;
}

.tabs-header-no-title::-webkit-scrollbar-thumb {
    background: var(--accent-blue);
    border-radius: 3px;
}

/* Tab buttons */
.tab-button {
    background: none;
    border: none;
    color: var(--main-text);
    font-family: "Libre Baskerville", serif;
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    opacity: 0.5;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid transparent;
    border-radius: 0.75rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
    white-space: nowrap;
    position: relative;
    flex-shrink: 0;
}

.tab-button:hover {
    opacity: 0.9;
    background: rgba(255, 255, 255, 0.02);
}

/* Color variants for tabs */
.tab-button.tab-blue {
    border-color: var(--accent-blue);
}

.tab-button.tab-green {
    border-color: var(--accent-green);
}

.tab-button.tab-yellow {
    border-color: var(--accent-yellow);
}

.tab-button.tab-fuschia {
    border-color: var(--accent-fuschia);
}

.tab-button.tab-lavender {
    border-color: var(--accent-lavender);
}

.tab-button.tab-red {
    border-color: var(--accent-red);
}

/* Active state with color variants */
.tab-button.active.tab-blue {
    opacity: 1;
    border-bottom-color: var(--accent-blue);
    color: var(--accent-blue);
    text-shadow: 0 0 10px var(--accent-blue);
    box-shadow: 0 0 12px rgba(0, 191, 255, 0.6);
}

.tab-button.active.tab-green {
    opacity: 1;
    border-bottom-color: var(--accent-green);
    color: var(--accent-green);
    text-shadow: 0 0 10px var(--accent-green);
    box-shadow: 0 0 12px rgba(0, 255, 159, 0.6);
}

.tab-button.active.tab-yellow {
    opacity: 1;
    border-bottom-color: var(--accent-yellow);
    color: var(--accent-yellow);
    text-shadow: 0 0 10px var(--accent-yellow);
    box-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
}

.tab-button.active.tab-fuschia {
    opacity: 1;
    border-bottom-color: var(--accent-fuschia);
    color: var(--accent-fuschia);
    text-shadow: 0 0 10px var(--accent-fuschia);
    box-shadow: 0 0 12px rgba(255, 0, 255, 0.6);
}

.tab-button.active.tab-lavender {
    opacity: 1;
    border-bottom-color: var(--accent-lavender);
    color: var(--accent-lavender);
    text-shadow: 0 0 10px var(--accent-lavender);
    box-shadow: 0 0 12px rgba(167, 139, 250, 0.6);
}

.tab-button.active.tab-red {
    opacity: 1;
    border-bottom-color: var(--accent-red);
    color: var(--accent-red);
    text-shadow: 0 0 10px var(--accent-red);
    box-shadow: 0 0 12px rgba(255, 77, 77, 0.6);
}

/* Content area */
.tabs-content {
    background: var(--background-color);
    border: 2px solid transparent;
    border-radius: 1rem;
    width: 100%;
    height: 220px;
}

.tabs-content.dynamic-height {
    height: auto;
    min-height: 180px;
}

/* Container border colors */
.tabs-content.content-border-blue {
    border-color: var(--accent-blue);
    box-shadow: 0 0 16px rgba(0, 191, 255, 0.4);
}

.tabs-content.content-border-green {
    border-color: var(--accent-green);
    box-shadow: 0 0 16px rgba(0, 255, 159, 0.4);
}

.tabs-content.content-border-yellow {
    border-color: var(--accent-yellow);
    box-shadow: 0 0 16px rgba(255, 215, 0, 0.4);
}

.tabs-content.content-border-fuschia {
    border-color: var(--accent-fuschia);
    box-shadow: 0 0 16px rgba(255, 0, 255, 0.4);
}

.tabs-content.content-border-lavender {
    border-color: var(--accent-lavender);
    box-shadow: 0 0 16px rgba(167, 139, 250, 0.4);
}

.tabs-content.content-border-red {
    border-color: var(--accent-red);
    box-shadow: 0 0 16px rgba(255, 77, 77, 0.4);
}

@media (max-width: 768px) {
    .tabs-header-title {
        font-size: 0.9rem;
    }

    .tab-button {
        font-size: 0.7rem;
        padding: 0.4rem 0.65rem;
    }

    .tabs-content {
        height: 160px;
    }

    .tabs-content.dynamic-height {
        min-height: 140px;
    }
}
</style>
