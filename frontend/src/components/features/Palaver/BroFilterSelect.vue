<template>
    <div class="bro-filter__select-wrapper">
        <select
            id="bro-filter-select"
            class="bro-filter__select"
            v-model="selectedBro"
            @change="handleChange"
        >
            <option value="">all bros</option>
            <option
                v-for="option in broOptions"
                :key="option.value"
                :value="option.value"
            >
                {{ option.label }}
            </option>
        </select>
        <div class="bro-filter__arrow">
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { usePalaverStore } from "@/stores/palaver";

const palaverStore = usePalaverStore();
const { allUsers } = useUserStore();

const selectedBro = ref("");

const broOptions = computed(() =>
    allUsers.map((user) => ({
        label: user.username,
        value: user.id,
    }))
);

const handleChange = () => {
    palaverStore.setFilteredBro(selectedBro.value);
};

watch(
    () => palaverStore.filteredBro,
    (bro) => {
        if (bro !== selectedBro.value) {
            selectedBro.value = bro;
        }
    },
    { immediate: true }
);
</script>

<style scoped>
.bro-filter__select-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1 0 auto;
    width: 10rem;
}

.bro-filter__select {
    width: 100%;
    min-height: 2.75rem;
    background-color: var(--background-color);
    color: var(--main-text);
    border: 2px solid var(--accent-fuschia);
    border-radius: 1rem;
    padding: 0.25rem 2rem 0.25rem 0.75rem;
    font-family: "Crimson Text", serif;
    font-size: 1.25rem;
    line-height: 1.2;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    transition: border-color 0.2s ease;
}

.bro-filter__select:focus {
    border-color: var(--accent-lavender);
    outline: none;
}

.bro-filter__arrow {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-40%);
    color: var(--accent-blue);
    pointer-events: none;
}

@media (max-width: 768px) {
    .bro-filter__select-wrapper {
        max-width: 8rem;
    }
    .bro-filter__select {
        min-height: 2rem;
        line-height: 1;
        font-size: 0.9rem;
    }
}
</style>
