<template>
    <div class="list-item-actions">
        <EditButton
            title="edit this book"
            :handleEdit="handleEdit"
            :buttonSize="buttonSize"
        />
        <DeleteButton
            title="remove from want to read"
            :handleDelete="handleRemove"
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
import type { BookshelfBook } from "@/types";
import EditButton from "@/components/ui/EditButton.vue";
import DeleteButton from "@/components/ui/DeleteButton.vue";
import MoveButton from "@/components/ui/MoveButton.vue";
import { useShelfModalStore } from "@/stores/shelfModal";

const props = defineProps<{
    book: BookshelfBook;
}>();

const { mobile } = useDisplay();

const shelfModalStore = useShelfModalStore();
const { openEditBook, openConfirmRemove, openConfirmMove } = shelfModalStore;

const handleEdit = () => {
    openEditBook(props.book, "wantToRead");
};

const handleRemove = () => {
    openConfirmRemove(props.book, "wantToRead");
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
    justify-content: flex-end;
    gap: 0.5rem;
}
</style>
