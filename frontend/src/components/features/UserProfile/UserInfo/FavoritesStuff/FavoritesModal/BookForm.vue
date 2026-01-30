<template>
    <div class="book-fav-form">
        <div class="tabs-selector">
            <button
                class="tab-button"
                :class="{ active: activeTab === 'myBooks' }"
                @click="activeTab = 'myBooks'"
            >
                your past
            </button>
            <button
                class="tab-button"
                :class="{ active: activeTab === 'search' }"
                @click="activeTab = 'search'"
            >
                divination (google)
            </button>
        </div>

        <div class="tab-content">
            <MyBooksTab
                v-if="activeTab === 'myBooks'"
                :selectedBooks="selectedBooks"
                :currentFavorites="parsedCurrentFavorites"
                @toggle="handleBookToggle"
            />
            <SearchBooksTab
                v-else
                :selectedBooks="selectedBooks"
                @toggle="handleBookToggle"
            />
        </div>

        <SelectedBooksList
            :selectedBooks="selectedBooks"
            @remove="handleBookRemove"
        />

        <div class="form-actions">
            <BaseButton
                variant="outline-secondary"
                :size="buttonSize"
                @click="handleCancel"
            >
                cancel
            </BaseButton>
            <BaseButton
                variant="outline"
                :size="buttonSize"
                :disabled="!selectedBooks.length"
                @click="handleSubmit"
            >
                ship'em ({{ selectedBooks.length }})
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import MyBooksTab from "./MyBooksTab.vue";
import SearchBooksTab from "./SearchBooksTab.vue";
import SelectedBooksList from "./SelectedBooksList.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import type { BookshelfBook } from "@/types";

const { mobile } = useDisplay();

defineOptions({
    name: "BookFavForm",
});

const props = defineProps<{
    currentFavorites: BookshelfBook[] | string[];
}>();

const emit = defineEmits<{
    (e: "submit", items: BookshelfBook[]): void;
    (e: "cancel"): void;
}>();

const activeTab = ref<"myBooks" | "search">("myBooks");
const selectedBooks = ref<BookshelfBook[]>([]);

const buttonSize = computed(() => {
    return mobile.value ? "small" : "medium";
});

const parsedCurrentFavorites = computed(() => {
    if (
        Array.isArray(props.currentFavorites) &&
        props.currentFavorites.length > 0
    ) {
        // Check if it's an array of strings (need to parse)
        if (typeof props.currentFavorites[0] === "string") {
            return (props.currentFavorites as string[]).map((str) =>
                JSON.parse(str)
            );
        }
        // Already an array of BookshelfBook
        return props.currentFavorites as BookshelfBook[];
    }
    return [];
});

const handleBookToggle = (book: BookshelfBook) => {
    const index = selectedBooks.value.findIndex((b) => b.id === book.id);
    if (index > -1) {
        selectedBooks.value.splice(index, 1);
    } else {
        selectedBooks.value.push(book);
    }
};

const handleBookRemove = (book: BookshelfBook) => {
    const index = selectedBooks.value.findIndex((b) => b.id === book.id);
    if (index > -1) {
        selectedBooks.value.splice(index, 1);
    }
};

const handleCancel = () => {
    selectedBooks.value = [];
    emit("cancel");
};

const handleSubmit = () => {
    if (selectedBooks.value.length > 0) {
        emit("submit", selectedBooks.value);
        selectedBooks.value = [];
    }
};
</script>

<style scoped>
.book-fav-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    min-height: 400px;
}

.tabs-selector {
    display: flex;
    gap: 0.5rem;
    border-bottom: 2px solid var(--accent-blue);
}

.tab-button {
    flex: 1;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    color: var(--text-muted);
    font-size: 1.25rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tab-button:hover {
    color: var(--accent-blue);
    background: color-mix(in srgb, var(--accent-blue) 5%, transparent);
}

.tab-button.active {
    color: var(--accent-blue);
    border-bottom-color: var(--accent-blue);
}

.tab-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid var(--accent-blue);
}

@media (max-width: 768px) {
    .book-fav-form {
        min-height: 350px;
        gap: 1.25rem;
    }

    .tab-button {
        padding: 0.6rem 0.75rem;
        font-size: 1rem;
    }

    .form-actions {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>
