<template>
    <BaseTooltip
        text="go home bro you're drunk"
        shadow-color="fuschia"
        :open-delay="750"
        :disabled="false"
        :show-tooltip="true"
        location="bottom"
    >
        <template #activator="{ props: tooltipProps }">
            <button v-bind="tooltipProps" class="logo" @click="handleClick">
                <FontAwesomeIcon icon="fa-solid fa-book-open-reader" />
                <h1>b&p</h1>
            </button>
        </template>
    </BaseTooltip>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps<{
    handleClick: () => void;
}>();
</script>

<style scoped>
.logo {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    text-decoration: none;
    z-index: 1001;
    margin: 0;
}

h1 {
    font-family: "Libre Baskerville", serif;
    font-size: 1.75rem;
    font-weight: 400;
    color: var(--accent-blue);
    text-align: center;
    margin: 0;
    padding: 0;
}
.logo:hover {
    color: var(--accent-fuschia);
    h1 {
        color: var(--accent-fuschia);
    }
}

@media (max-width: 768px) {
    h1 {
        font-size: 1.5rem;
    }
}
</style>
