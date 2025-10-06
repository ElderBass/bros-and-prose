<template>
    <div :class="`future-books-list-${listLayout}`">
        <FutureBookItem
            v-for="book in futureBooks"
            :key="book.id"
            :book="book"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FutureBookItem from "./FutureBookItem.vue";
import { useBooksStore } from "@/stores/books";
import { storeToRefs } from "pinia";
import { useUIStore } from "@/stores/ui";

const { futureBooks } = useBooksStore();
const { isMobile } = storeToRefs(useUIStore());

const listLayout = computed(() => {
    return isMobile.value ? "column" : "row";
});
</script>

<style scoped>
.future-books-list-row {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
}

.future-books-list-column {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
}
</style>
