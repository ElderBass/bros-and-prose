<template>
    <BaseMenu accentColor="green" hoverColor="blue" location="top left">
        <template #activator="{ props: menuProps }">
            <FloatingActionButton
                v-bind="menuProps"
                :icon="faBookMedical"
                title="add a book"
                @click="(event?: MouseEvent) => {}"
            />
        </template>
        <template #items>
            <v-list-item @click="openAddBookModal">
                <v-list-item-title>add a book</v-list-item-title>
            </v-list-item>
            <v-list-item @click="openPalaverModal">
                <v-list-item-title>palaver</v-list-item-title>
            </v-list-item>
        </template>
    </BaseMenu>

    <AddBookModal
        v-if="addBookModalOpen"
        :open="addBookModalOpen"
        @close="addBookModalOpen = false"
    />
</template>

<script setup lang="ts">
import { ref } from "vue";
import AddBookModal from "@/components/modal/AddBookModal.vue";
import { faBookMedical } from "@fortawesome/free-solid-svg-icons";
import { usePalaverStore } from "@/stores/palaver";

const addBookModalOpen = ref(false);

const palaver = usePalaverStore();

const openAddBookModal = () => {
    addBookModalOpen.value = true;
};

const openPalaverModal = () => {
    palaver.openItemModal("create");
};
</script>
