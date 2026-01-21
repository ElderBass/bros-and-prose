<template>
    <div class="list-item-actions">
        <EditButton
            v-if="isLoggedInUser"
            title="edit this book"
            :handleEdit="handleEdit"
            :buttonSize="buttonSize"
        />
        <DeleteButton
            v-if="isLoggedInUser"
            :title="deleteTitle"
            :handleDelete="handleRemove"
            :buttonSize="buttonSize"
        />
        <MoveBookMenuButton
            v-if="!isGuestUser()"
            :useIconButton="true"
            :isLoggedInUser="isLoggedInUser"
            :book="book"
            :buttonSize="buttonSize"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { BookshelfBook, ButtonSize, Shelf } from "@/types";
import EditButton from "@/components/ui/EditButton.vue";
import DeleteButton from "@/components/ui/DeleteButton.vue";
import MoveBookMenuButton from "@/components/features/UserProfile/Shelves/MoveBookMenuButton.vue";
import { useShelfModalStore } from "@/stores/shelfModal";
import { isGuestUser } from "@/utils";

const props = defineProps<{
    book: BookshelfBook;
    shelf: Shelf;
    isLoggedInUser: boolean;
}>();

const { mobile } = useDisplay();

const shelfModalStore = useShelfModalStore();
const { openEditBook, openConfirmRemove } = shelfModalStore;

const handleEdit = () => {
    openEditBook(props.book, props.shelf);
};

const handleRemove = () => {
    openConfirmRemove(props.book, props.shelf);
};

const buttonSize = computed<ButtonSize>(() =>
    mobile.value ? "xsmall" : "small"
);

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
