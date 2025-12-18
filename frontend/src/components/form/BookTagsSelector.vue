<template>
    <div class="tags-container">
        <BookTag
            v-for="tag in COMMON_BOOK_TAGS"
            :key="tag"
            :tag="tag"
            :selected="tags.includes(tag)"
            :onClick="() => onClick(tag)"
            :size="mobile ? 'xsmall' : 'small'"
        />
    </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { COMMON_BOOK_TAGS } from "@/constants";
import BookTag from "@/components/ui/BookTag.vue";

const { mobile } = useDisplay();

defineProps<{
    tags: string[];
    onClick: (tag: string) => void;
}>();
</script>

<style scoped>
.tags-container {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
    min-height: 100px;
    width: 100%;
}
</style>
