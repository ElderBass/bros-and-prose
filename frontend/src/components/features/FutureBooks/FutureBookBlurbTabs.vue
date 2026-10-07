<template>
    <div class="blurb-tabs" :class="`active-${activeTab}`">
        <div v-if="hasBlurb" class="tab-toggle" role="tablist">
            <button
                v-for="tab in TABS"
                :key="tab.id"
                type="button"
                role="tab"
                class="tab-pill"
                :class="[`tab-${tab.id}`, { active: activeTab === tab.id }]"
                :aria-selected="activeTab === tab.id"
                @click="activeTab = tab.id"
            >
                {{ tab.label }}
            </button>
        </div>
        <h4 v-else class="synopsis-label">elite synopsis</h4>
        <Transition name="tab-fade" mode="out-in">
            <ExpandableText
                v-if="activeTab === 'blurb'"
                key="blurb"
                role="tabpanel"
                :text="blurb ?? ''"
                :truncateLength="200"
            />
            <ExpandableText
                v-else
                key="synopsis"
                role="tabpanel"
                :text="description || EMPTY_GOOGLE_TEXT"
                :truncateLength="100"
            />
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ExpandableText from "@/components/features/common/ExpandableText.vue";
import { EMPTY_GOOGLE_TEXT } from "@/constants";

type TabId = "blurb" | "synopsis";

const TABS: { id: TabId; label: string }[] = [
    { id: "blurb", label: "bro's dumbass blurb" },
    { id: "synopsis", label: "elite synopsis" },
];

const props = defineProps<{
    blurb?: string;
    description?: string;
}>();

const hasBlurb = computed(() => !!props.blurb?.trim());

const activeTab = ref<TabId>(hasBlurb.value ? "blurb" : "synopsis");
</script>

<style scoped>
.blurb-tabs {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.tab-toggle {
    display: inline-flex;
    align-self: flex-start;
    padding: 0.2rem;
    gap: 0.2rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-pill {
    background: none;
    border: 1px solid transparent;
    border-radius: 999px;
    padding: 0.3rem 0.85rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--main-text);
    opacity: 0.6;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-pill:hover {
    opacity: 0.9;
}

.tab-pill.active {
    opacity: 1;
}

.tab-pill.tab-blurb.active {
    color: var(--accent-fuschia);
    border-color: var(--accent-fuschia);
    background: rgba(255, 0, 255, 0.08);
    box-shadow: 0 0 10px rgba(255, 0, 255, 0.25);
}

.tab-pill.tab-synopsis.active {
    color: var(--accent-blue);
    border-color: var(--accent-blue);
    background: rgba(0, 191, 255, 0.08);
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.25);
}

.synopsis-label {
    margin: 0;
    padding-left: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--accent-blue);
    opacity: 0.8;
}

.active-blurb :deep(.text) {
    border-color: var(--accent-fuschia);
}

.tab-fade-enter-active,
.tab-fade-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}

.tab-fade-enter-from {
    opacity: 0;
    transform: translateY(6px);
}

.tab-fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

@media (max-width: 768px) {
    .tab-pill {
        font-size: 0.75rem;
        padding: 0.25rem 0.6rem;
    }

    .synopsis-label {
        font-size: 0.875rem;
    }
}
</style>
