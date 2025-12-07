<template>
    <div class="shelf-selector">
        <BaseButton
            :variant="getVariant('haveRead')"
            :size="buttonSize"
            title="books you've already read"
            @click="$emit('selectShelf', 'haveRead')"
            :disabled="disabled"
        >
            have read
        </BaseButton>
        <BaseButton
            :variant="getVariant('wantToRead')"
            :size="buttonSize"
            title="books you want to read"
            @click="$emit('selectShelf', 'wantToRead')"
            :disabled="disabled"
        >
            want to read
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";

defineOptions({
    name: "ShelfSelector",
});

defineEmits<{
    selectShelf: [shelf: "wantToRead" | "haveRead"];
}>();

const props = defineProps<{
    selectedShelf: "wantToRead" | "haveRead";
    disabled?: boolean;
}>();

const { mobile } = useDisplay();

const buttonSize = computed(() => {
    return mobile.value ? "xsmall" : "small";
});

const getVariant = (shelf: "wantToRead" | "haveRead") => {
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
