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
        <BaseMenu
            accentColor="green"
            hoverColor="lavender"
            location="bottom end"
        >
            <template #activator="{ props: menuProps }">
                <MoveButton
                    v-bind="menuProps"
                    title="move this book"
                    :buttonSize="buttonSize"
                />
            </template>
            <template #items>
                <v-list-item @click="handleMove('currentlyReading')">
                    <v-list-item-title>currently reading</v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleMove('haveRead')">
                    <v-list-item-title>have read</v-list-item-title>
                </v-list-item>
            </template>
        </BaseMenu>
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
import type { Shelf } from "@/types";

const props = defineProps<{
    book: BookshelfBook;
}>();

const { mobile } = useDisplay();

const shelfModalStore = useShelfModalStore();
const { openEditBook, openConfirmRemove, openConfirmMoveTo } = shelfModalStore;

const handleEdit = () => {
    openEditBook(props.book, "wantToRead");
};

const handleRemove = () => {
    openConfirmRemove(props.book, "wantToRead");
};

const handleMove = (targetShelf: Shelf) => {
    openConfirmMoveTo(props.book, targetShelf);
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
