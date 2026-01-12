<template>
    <div class="step-form">
        <h3 class="step-title">add favorite authors</h3>
        <p class="step-description">
            list the authors whose work you admire (optional)
        </p>

        <div class="items-list">
            <div
                v-for="(author, index) in localAuthors"
                :key="index"
                class="item-row"
            >
                <BaseInput
                    v-model="localAuthors[index]"
                    :size="mobile ? 'small' : 'medium'"
                    placeholder="e.g., Ursula K. Le Guin"
                    @keydown.enter="addAuthor"
                />
                <IconButton
                    :icon="faTrash"
                    :size="mobile ? 'xsmall' : 'small'"
                    color="red"
                    title="Remove author"
                    :handleClick="() => removeAuthor(index)"
                />
            </div>
        </div>

        <BaseButton
            variant="outline"
            color="blue"
            :size="mobile ? 'xsmall' : 'small'"
            :icon="faPlus"
            @click="addAuthor"
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

const localAuthors = ref<string[]>([...props.modelValue]);

// Ensure at least one empty input
if (localAuthors.value.length === 0) {
    localAuthors.value.push("");
}

const addAuthor = () => {
    localAuthors.value.push("");
};

const removeAuthor = (index: number) => {
    localAuthors.value.splice(index, 1);
    if (localAuthors.value.length === 0) {
        localAuthors.value.push("");
    }
};

watch(
    localAuthors,
    (newVal) => {
        const filtered = newVal.filter((a) => a.trim() !== "");
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
    width: 100%;
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
