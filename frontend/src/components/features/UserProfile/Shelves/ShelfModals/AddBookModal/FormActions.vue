<template>
    <div class="form-actions">
        <BaseButton
            variant="outline-secondary"
            size="small"
            title="cancel adding this book"
            @click="$emit('closeModal')"
            :style="{ width: mobile ? '100%' : '50%' }"
        >
            cancel
        </BaseButton>
        <BaseButton
            size="small"
            :disabled="!canSubmit"
            variant="success"
            type="submit"
            :title="`add to ${shelfDisplayName} shelf`"
            :style="{ width: mobile ? '100%' : '50%' }"
        >
            add to shelf
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

defineProps<{
    canSubmit: boolean;
    shelfDisplayName: string;
}>();

defineEmits<{
    closeModal: [];
}>();

const { mobile } = useDisplay();
</script>

<style scoped>
.form-actions {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 1rem;
    width: 100%;
    margin-top: 1rem;
}
</style>
