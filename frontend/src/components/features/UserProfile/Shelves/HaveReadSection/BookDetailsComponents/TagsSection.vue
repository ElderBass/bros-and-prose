<template>
    <div v-if="book.tags?.length" class="tags">
        <BookTag
            v-for="tag in book.tags"
            :key="tag"
            :tag="tag"
            :selected="true"
            color="green"
            :size="mobile ? 'xsmall' : 'small'"
        />
    </div>
    <NoTags v-else :size="mobile ? 'small' : 'medium'" />
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import type { BookshelfBook } from "@/types";
import BookTag from "@/components/ui/BookTag.vue";
import NoTags from "@/components/features/common/NoTags.vue";

defineProps<{
    book: BookshelfBook;
}>();

const { mobile } = useDisplay();
</script>

<style scoped>
.tags {
    margin-top: 0.5rem;
    display: flex;
    flex-wrap: wrap;
}
</style>
