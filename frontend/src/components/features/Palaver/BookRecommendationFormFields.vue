<template>
    <div class="rec-fields">
        <BaseInput
            id="palaver-book-rec-title-input"
            :modelValue="recTitle"
            label="title"
            placeholder="book title"
            :size="mobile ? 'small' : 'medium'"
        />
        <BaseInput
            id="palaver-book-rec-author-input"
            :modelValue="recAuthor"
            label="author"
            placeholder="book author"
            :size="mobile ? 'small' : 'medium'"
        />
        <BookTagsSelector :tags="tags" :onClick="onTagClick" />
    </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import BookTagsSelector from "@/components/form/BookTagsSelector.vue";

const { mobile } = useDisplay();

defineProps<{
    recTitle: string;
    recAuthor: string;
    tags: string[];
    onTagClick: (tag: string) => void;
}>();

defineEmits<{
    (e: "update:recTitle", value: string): void;
    (e: "update:recAuthor", value: string): void;
}>();
</script>

<style scoped>
.rec-fields {
    display: flex;
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .rec-fields {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>
