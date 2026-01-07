<template>
    <BaseMenu accentColor="green" hoverColor="lavender" location="top end">
        <template #activator="{ props: menuProps }">
            <MoveButton
                v-if="useIconButton"
                v-bind="menuProps"
                title="move this book"
                :buttonSize="buttonSize"
            />
            <BaseButton
                v-else
                variant="outline-success"
                title="add to shelf"
                v-bind="menuProps"
                :size="buttonSize"
            >
                add to shelf
            </BaseButton>
        </template>
        <template #items>
            <v-list-item
                v-if="showListItem('currentlyReading')"
                @click="handleMove('currentlyReading')"
            >
                <v-list-item-title>currently reading</v-list-item-title>
            </v-list-item>
            <v-list-item
                v-if="showListItem('wantToRead')"
                @click="handleMove('wantToRead')"
            >
                <v-list-item-title>want to read</v-list-item-title>
            </v-list-item>
            <v-list-item
                v-if="showListItem('haveRead')"
                @click="handleMove('haveRead')"
            >
                <v-list-item-title>have read</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="isLoggedInUser" @click="handleRecommend">
                <v-list-item-title>recommend</v-list-item-title>
            </v-list-item>
        </template>
    </BaseMenu>
</template>

<script setup lang="ts">
import MoveButton from "@/components/ui/MoveButton.vue";
import { recommendBook } from "@/utils";
import { useShelfModalStore } from "@/stores/shelfModal";
import type { BookshelfBook, ButtonSize, Shelf } from "@/types";
import { storeToRefs } from "pinia";

const props = defineProps<{
    book: BookshelfBook;
    useIconButton: boolean;
    buttonSize: ButtonSize;
    isLoggedInUser: boolean;
}>();
const shelfModalStore = useShelfModalStore();
const { openConfirmMoveTo } = shelfModalStore;

const { selectedBookShelf } = storeToRefs(shelfModalStore);

const handleMove = (targetShelf: Shelf) => {
    openConfirmMoveTo(props.book, targetShelf);
};

const handleRecommend = () => recommendBook(props.book);

const showListItem = (shelf: Shelf) => {
    if (!props.isLoggedInUser) return true;
    return selectedBookShelf.value !== shelf;
};
</script>
