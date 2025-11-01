<template>
    <div class="edit-actions">
        <EditButton
            title="fix your silly blurb, change the tags, etc."
            :handleEdit="handleEdit"
        />
        <DeleteButton
            title="delete this drivel and choose something actually interesting"
            :handleDelete="handleDelete"
        />
    </div>
</template>

<script setup lang="ts">
import EditButton from "@/components/ui/EditButton.vue";
import DeleteButton from "@/components/ui/DeleteButton.vue";

defineProps<{
    handleEdit: () => void;
    handleDelete: () => void;
}>();
</script>

<style scoped>
.edit-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
}
</style>
