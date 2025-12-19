<template>
    <div class="controls">
        <input
            class="search-input"
            :value="modelValue"
            @input="
                emit(
                    'update:modelValue',
                    ($event.target as HTMLInputElement).value
                )
            "
            id="have-read-filter"
            aria-label="filter have read"
            :placeholder="placeholder"
        />
        <ClearSearchButton
            v-if="hasQuery"
            :onClick="() => emit('update:modelValue', '')"
            :size="mobile ? 'xsmall' : 'small'"
        />
        <FontAwesomeIcon v-else :icon="faSearch" class="search-icon" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ClearSearchButton from "../ShelfModals/FormStuff/ClearSearchButton.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const props = withDefaults(
    defineProps<{
        modelValue: string;
        totalCount: number;
        visibleCount: number;
        placeholder?: string;
    }>(),
    {
        placeholder: "sift through the past (author, title)",
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const hasQuery = computed(() => props.modelValue.trim().length > 0);
</script>

<style scoped>
.controls {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    padding: 0.75rem;
    border-bottom: 1px solid
        color-mix(in srgb, var(--accent-green) 35%, transparent);
    background: color-mix(
        in srgb,
        var(--accent-green) 4%,
        var(--surface-color)
    );
}

.search-input {
    width: 100%;
    background-color: transparent;
    color: var(--main-text);
    border: none;
    border-bottom: 2px solid
        color-mix(in srgb, var(--accent-green) 60%, transparent);
    border-radius: 0;
    padding: 0.4rem 0.1rem;
    font-family: "Crimson Text", serif;
    font-size: 1.05rem;
    outline: none;
    transition:
        border-color 0.2s ease,
        color 0.2s ease;
}

.search-input::placeholder {
    color: var(--main-text);
    opacity: 0.55;
    font-style: italic;
}

.search-input:focus {
    border-bottom-color: var(--accent-lavender);
}

.search-icon {
    font-size: 1rem;
    color: var(--accent-blue);
    opacity: 0.75;
}

@media (max-width: 768px) {
    .controls {
        padding: 0.5rem;
        gap: 0.5rem;
    }

    .search-input {
        font-size: 1rem;
    }
}
</style>
