<template>
    <div class="rec-fields">
        <div class="rec-inputs">
            <BaseInput
                id="palaver-book-rec-title-input"
                v-model="title"
                @update:modelValue="onRecTitleChange"
                label="title"
                placeholder="book title"
                :size="mobile ? 'small' : 'medium'"
            />
            <BaseInput
                id="palaver-book-rec-author-input"
                v-model="author"
                @update:modelValue="onRecAuthorChange"
                label="author"
                placeholder="book author"
                :size="mobile ? 'small' : 'medium'"
            />
        </div>
        <TagPickerTrigger
            v-model="tagsProxy"
            label="tags (required)"
            variant="drawer"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import TagPickerTrigger from "@/components/form/TagPicker/TagPickerTrigger.vue";

const { mobile } = useDisplay();

const props = defineProps<{
    modelValue: string[];
    recTitle: string;
    recAuthor: string;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string[]): void;
    (e: "update:recTitle", value: string): void;
    (e: "update:recAuthor", value: string): void;
}>();

const title = ref(props.recTitle);
const author = ref(props.recAuthor);

const tagsProxy = computed<string[]>({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

const onRecTitleChange = (value: string) => {
    title.value = value;
    emit("update:recTitle", value);
};
const onRecAuthorChange = (value: string) => {
    author.value = value;
    emit("update:recAuthor", value);
};
</script>

<style scoped>
.rec-fields {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}
.rec-inputs {
    display: flex;
    gap: 0.5rem;
    width: 100%;
}
@media (max-width: 768px) {
    .rec-fields {
        gap: 0.75rem;
    }
    .rec-inputs {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>
