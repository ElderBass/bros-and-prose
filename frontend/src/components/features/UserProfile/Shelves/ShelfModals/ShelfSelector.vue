<template>
    <div class="shelf-selector">
        <BaseButton
            :variant="getVariant('haveRead')"
            :size="buttonSize"
            title="fucking shit you've sent, my dude"
            @click="selectShelf('haveRead')"
            :disabled="disabled"
        >
            have read
        </BaseButton>
        <BaseButton
            :variant="getVariant('wantToRead')"
            :size="buttonSize"
            title="books that need to get got"
            @click="selectShelf('wantToRead')"
            :disabled="disabled"
        >
            want to read
        </BaseButton>
        <BaseButton
            :variant="getVariant('currentlyReading')"
            :size="buttonSize"
            title="that side hustle book"
            @click="selectShelf('currentlyReading')"
            :disabled="disabled"
        >
            currently reading
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import type { Shelf } from "@/types";
import { useShelfModalStore } from "@/stores/shelfModal";

defineOptions({
    name: "ShelfSelector",
});

defineProps<{
    disabled?: boolean;
}>();

const shelfModalStore = useShelfModalStore();
const { selectedBookShelf } = storeToRefs(shelfModalStore);

const { mobile } = useDisplay();

const selectShelf = (shelf: Shelf) => {
    shelfModalStore.selectedBookShelf = shelf;
};

const buttonSize = computed(() => {
    return mobile.value ? "xsmall" : "small";
});

const getVariant = (shelf: Shelf) => {
    return selectedBookShelf.value === shelf
        ? "secondary"
        : "outline-secondary";
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
