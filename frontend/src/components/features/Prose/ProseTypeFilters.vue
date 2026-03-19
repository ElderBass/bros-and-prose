<template>
    <div class="filters-wrap">
        <BaseButton
            v-for="option in typeOptions"
            :key="option.value"
            :size="mobile ? 'xsmall' : 'small'"
            :variant="
                filters.includes(option.value)
                    ? 'secondary'
                    : 'outline-secondary'
            "
            :title="`filter by ${option.label}`"
            :showTooltip="false"
            @click="toggleFilter(option.value)"
        >
            {{ option.label }}
        </BaseButton>
        <select
            v-model="selectedBroId"
            class="bro-select"
            aria-label="filter by bro"
            @change="onBroChange"
        >
            <option value="">all bros</option>
            <option v-for="user in broOptions" :key="user.id" :value="user.id">
                {{ user.username }}
            </option>
        </select>
        <IconButton
            :disabled="clearDisabled"
            :icon="faXmark"
            :size="mobile ? 'xsmall' : 'small'"
            color="red"
            title="clear filters"
            :handleClick="clearFilters"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import BaseButton from "@/components/ui/BaseButton.vue";
import IconButton from "@/components/ui/IconButton.vue";
import { useProseStore } from "@/stores/prose";
import { useUserStore } from "@/stores/user";
import type { ProseType } from "@/types";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const { mobile } = useDisplay();
const proseStore = useProseStore();
const { filters, filteredBro } = storeToRefs(proseStore);
const { addFilter, removeFilter, clearFilters: storeClearFilters } = proseStore;
const { allUsers } = storeToRefs(useUserStore());

const selectedBroId = ref(filteredBro.value);

const typeOptions: Array<{ label: string; value: ProseType }> = [
    { label: "creative", value: "creative" },
    { label: "academic", value: "academic" },
    { label: "poetic", value: "poetic" },
    { label: "misc", value: "misc" },
];

const broOptions = computed(() => allUsers.value);

const clearDisabled = computed(
    () => filters.value.length === 0 && filteredBro.value === ""
);

watch(
    () => filteredBro.value,
    (bro) => {
        if (bro !== selectedBroId.value) selectedBroId.value = bro;
    },
    { immediate: true }
);

function toggleFilter(type: ProseType) {
    if (filters.value.includes(type)) {
        removeFilter(type);
    } else {
        addFilter(type);
    }
}

function onBroChange() {
    proseStore.setFilteredBro(selectedBroId.value);
}

function clearFilters() {
    storeClearFilters();
    selectedBroId.value = "";
}
</script>

<style scoped>
.filters-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.5rem 0;
}

.bro-select {
    min-height: 2.25rem;
    padding: 0.25rem 2rem 0.25rem 0.75rem;
    background-color: var(--background-color);
    color: var(--main-text);
    border: 2px solid var(--accent-fuschia);
    border-radius: 1rem;
    font-family: inherit;
    font-size: 0.95rem;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
}

.bro-select:focus {
    border-color: var(--accent-lavender);
    outline: none;
}

@media (max-width: 768px) {
    .filters-wrap {
        gap: 0.25rem;
    }
    .bro-select {
        min-height: 2rem;
        font-size: 0.75rem;
        max-width: 7rem;
    }
}
</style>
