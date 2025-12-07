<template>
    <div class="list-item-actions">
        <EditButton
            title="edit this book"
            :handleEdit="handleEdit"
            :buttonSize="buttonSize"
        />
        <DeleteButton
            title="remove from want to read"
            :handleDelete="handleDelete"
            :buttonSize="buttonSize"
        />
        <MoveButton
            title="move to have read"
            :handleMove="handleMove"
            :buttonSize="buttonSize"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { FutureBook } from "@/types";
import EditButton from "@/components/ui/EditButton.vue";
import DeleteButton from "@/components/ui/DeleteButton.vue";
import MoveButton from "@/components/ui/MoveButton.vue";
import { useShelfModalStore } from "@/stores/shelfModal";

const props = defineProps<{
    book: FutureBook;
}>();

const { mobile } = useDisplay();

const shelfModalStore = useShelfModalStore();
const { openEditBook, openConfirmDelete, openConfirmMove } = shelfModalStore;

const handleEdit = () => {
    openEditBook(props.book, "wantToRead");
};

const handleDelete = () => {
    openConfirmDelete(props.book, "wantToRead");
};

const handleMove = () => {
    openConfirmMove(props.book);
};

const buttonSize = computed(() => {
    return mobile.value ? "supersmall" : "small";
});
</script>

<style scoped>
.list-item-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>
