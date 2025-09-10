<template>
    <AppLayout>
        <div class="present-view">
            <div v-if="isLoading" class="spinner-container">
                <LoadingSpinner
                    v-if="isLoading"
                    size="large"
                    message="retrieving the current prose, bros..."
                />
            </div>
            <CurrentBook v-else :book="book" />
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import CurrentBook from "@/components/features/CurrentBook/CurrentBookContainer.vue";
import { useBooks } from "@/composables/useBooks";
import { useBooksStore } from "@/stores/books";
import type { Book } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const { currentBook: storedCurrentBook } = useBooksStore();
const { getCurrentBook } = useBooks();

const isLoading = ref(true);
const book = ref<Book>(storedCurrentBook);

watch(storedCurrentBook, (newBook) => {
    book.value = newBook;
});

onMounted(async () => {
    try {
        if (!book.value.id) {
            isLoading.value = true;
            const currentBook = await getCurrentBook();
            book.value = currentBook;
        }
    } catch (error) {
        console.error("Error fetching current book", error);
    } finally {
        setTimeout(() => {
            isLoading.value = false;
        }, 2000);
    }
});
</script>

<style scoped>
.present-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    margin: 0 auto;
}

.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

@media (min-width: 768px) {
    .present-view {
        width: 50%;
    }
}
</style>
