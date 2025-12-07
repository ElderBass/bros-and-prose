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
            :title="
                props.action === 'update'
                    ? `update book in ${props.shelfDisplayName} shelf`
                    : `add to ${props.shelfDisplayName} shelf`
            "
            :style="{ width: mobile ? '100%' : '50%' }"
        >
            {{ props.action === "update" ? "update book" : "add to shelf" }}
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const props = withDefaults(
    defineProps<{
        canSubmit: boolean;
        shelfDisplayName: string;
        action?: "add" | "update";
    }>(),
    {
        action: "add",
    }
);

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
