<template>
    <div class="list-item-actions">
        <EditButton
            title="edit this book"
            :handleEdit="handleEdit"
            :buttonSize="buttonSize"
        />
        <DeleteButton
            :title="deleteTitle"
            :handleDelete="handleRemove"
            :buttonSize="buttonSize"
        />

        <template v-if="shelf === 'wantToRead'">
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
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { BookshelfBook, Shelf } from "@/types";
import EditButton from "@/components/ui/EditButton.vue";
import DeleteButton from "@/components/ui/DeleteButton.vue";
import MoveButton from "@/components/ui/MoveButton.vue";
import { useShelfModalStore } from "@/stores/shelfModal";

const props = defineProps<{
    book: BookshelfBook;
    shelf: Shelf;
}>();

const { mobile } = useDisplay();

const shelfModalStore = useShelfModalStore();
const { openEditBook, openConfirmRemove, openConfirmMoveTo } = shelfModalStore;

const handleEdit = () => {
    openEditBook(props.book, props.shelf);
};

const handleRemove = () => {
    openConfirmRemove(props.book, props.shelf);
};

const handleMove = (targetShelf: Shelf) => {
    openConfirmMoveTo(props.book, targetShelf);
};

const buttonSize = computed(() => (mobile.value ? "supersmall" : "small"));

const deleteTitle = computed(() => {
    return props.shelf === "currentlyReading"
        ? "remove from currently reading"
        : "remove from want to read";
});
</script>

<style scoped>
.list-item-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}
</style>
