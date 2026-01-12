<template>
    <div class="step-form">
        <h3 class="step-title">add favorite genres</h3>
        <p class="step-description">
            what genres do you gravitate towards? (optional)
        </p>

        <div class="items-list">
            <div
                v-for="(genre, index) in localGenres"
                :key="index"
                class="item-row"
            >
                <BaseInput
                    v-model="localGenres[index]"
                    placeholder="e.g., Science Fiction"
                    :size="mobile ? 'small' : 'medium'"
                    @keydown.enter="addGenre"
                />
                <IconButton
                    :icon="faTrash"
                    :size="mobile ? 'xsmall' : 'small'"
                    color="red"
                    title="Remove genre"
                    :handleClick="() => removeGenre(index)"
                />
            </div>
        </div>

        <BaseButton
            variant="outline"
            color="blue"
            :size="mobile ? 'xsmall' : 'small'"
            :icon="faPlus"
            @click="addGenre"
        >
            add another
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const { mobile } = useDisplay();

const props = defineProps<{
    modelValue: string[];
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string[]): void;
}>();

const localGenres = ref<string[]>([...props.modelValue]);

// Ensure at least one empty input
if (localGenres.value.length === 0) {
    localGenres.value.push("");
}

const addGenre = () => {
    localGenres.value.push("");
};

const removeGenre = (index: number) => {
    localGenres.value.splice(index, 1);
    if (localGenres.value.length === 0) {
        localGenres.value.push("");
    }
};

watch(
    localGenres,
    (newVal) => {
        const filtered = newVal.filter((g) => g.trim() !== "");
        emit("update:modelValue", filtered);
    },
    { deep: true }
);
</script>

<style scoped>
.step-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem 0;
}

.step-title {
    font-family: "Libre Baskerville", serif;
    font-size: 1.5rem;
    color: var(--accent-pink);
    margin: 0;
    text-transform: lowercase;
}

.step-description {
    font-size: 0.95rem;
    opacity: 0.8;
    margin: 0;
}

.items-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.item-row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}
</style>
