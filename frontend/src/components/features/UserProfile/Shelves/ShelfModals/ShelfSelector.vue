<template>
    <div class="shelf-selector">
        <BaseButton
            :variant="getVariant('haveRead')"
            :size="buttonSize"
            title="fucking shit you've sent, my dude"
            @click="$emit('selectShelf', 'haveRead')"
            :disabled="disabled"
        >
            have read
        </BaseButton>
        <BaseButton
            :variant="getVariant('wantToRead')"
            :size="buttonSize"
            title="books that need to get got"
            @click="$emit('selectShelf', 'wantToRead')"
            :disabled="disabled"
        >
            want to read
        </BaseButton>
        <BaseButton
            :variant="getVariant('currentlyReading')"
            :size="buttonSize"
            title="that side hustle book"
            @click="$emit('selectShelf', 'currentlyReading')"
            :disabled="disabled"
        >
            currently reading
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { Shelf } from "@/types";

defineOptions({
    name: "ShelfSelector",
});

defineEmits<{
    selectShelf: [shelf: Shelf];
}>();

const props = defineProps<{
    selectedShelf: Shelf;
    disabled?: boolean;
}>();

const { mobile } = useDisplay();

const buttonSize = computed(() => {
    return mobile.value ? "xsmall" : "small";
});

const getVariant = (shelf: Shelf) => {
    return props.selectedShelf === shelf ? "secondary" : "outline-secondary";
};
</script>

<style scoped>
.shelf-selector {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
}

@media (max-width: 768px) {
    .shelf-selector {
        gap: 0.5rem;
    }
}
</style>
