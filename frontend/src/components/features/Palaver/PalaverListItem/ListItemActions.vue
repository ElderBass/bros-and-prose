<template>
    <div v-if="showEditActions" class="edit-actions">
        <EditButton
            title="edit your dumbass shit"
            :handleEdit="handleEdit"
            :buttonSize="buttonSize"
        />
        <DeleteButton
            title="get that shit outta here"
            :handleDelete="handleDelete"
            :buttonSize="buttonSize"
        />
        <CommentButton :entry="entry" />
    </div>
    <ReactionActions v-else :entry="entry" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import type { PalaverEntry } from "@/types";
import EditButton from "@/components/ui/EditButton.vue";
import DeleteButton from "@/components/ui/DeleteButton.vue";
import CommentButton from "@/components/features/Palaver/PalaverListItem/CommentButton.vue";
import ReactionActions from "@/components/features/Palaver/PalaverListItem/ReactionActions.vue";
import { useUserStore } from "@/stores/user";
import { useDisplay } from "vuetify";
import { usePalaverStore } from "@/stores/palaver";

const props = defineProps<{ entry: PalaverEntry }>();

const { mobile } = useDisplay();
const userStore = useUserStore();
const palaver = usePalaverStore();
const { openConfirmDeleteModal, openItemModal } = palaver;

const { loggedInUser } = storeToRefs(userStore);

const showEditActions = computed(() => {
    return props.entry.userInfo.username === loggedInUser.value?.username;
});

const buttonSize = computed(() => {
    return mobile.value ? "xsmall" : "small";
});

const handleEdit = () => {
    openItemModal("update", props.entry);
};

const handleDelete = () => {
    openConfirmDeleteModal(props.entry);
};
</script>

<style scoped>
.edit-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>
