<template>
    <div :class="`future-books-list-${listLayout}`">
        <template v-for="i in [0, 1, 2]">
            <FutureBookItem
                v-if="futureBooks[i]"
                :key="futureBooks[i].id"
                :book="futureBooks[i]"
                :isMostVoted="futureBooks[i].id === mostVotedFutureBookId"
            />
            <div v-else :key="i" class="future-books-list-item-placeholder">
                <p>nothing to see here</p>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FutureBookItem from "./FutureBookItem.vue";
import type { FutureBook } from "@/types";
import { storeToRefs } from "pinia";
import { useUIStore } from "@/stores/ui";

const props = defineProps<{
    futureBooks: FutureBook[];
    mostVotedFutureBookId: string;
}>();

console.log(
    "KERTWANGING mostVotedFutureBookId in FutureBooksList",
    props.mostVotedFutureBookId
);

const { isMobile } = storeToRefs(useUIStore());

const listLayout = computed(() => {
    return isMobile.value ? "column" : "row";
});
</script>

<style scoped>
.future-books-list-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.5rem;
    width: 100%;
}

.future-books-list-column {
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    width: 100%;
    gap: 1.5rem;
    height: 100%;
}

.future-books-list-item-placeholder {
    width: 100%;
    height: 100%;
    border: 2px dashed var(--accent-blue);
    border-radius: 1rem;
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );

    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: var(--accent-blue);
    font-family: "Libre Baskerville", serif;
    font-style: italic;
    padding: 2rem;
}

@media (max-width: 1024px) {
    .future-books-list-row {
        grid-template-columns: 1fr;
    }
}
@media (max-width: 768px) {
    .future-books-list-item-placeholder {
        font-size: 1.25rem;
    }
}
</style>
