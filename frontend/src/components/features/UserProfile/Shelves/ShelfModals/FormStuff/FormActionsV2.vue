<template>
    <div class="form-actions">
        <BaseButton
            variant="outline-secondary"
            title="go back to search results"
            @click="$emit('cancel')"
            v-bind="buttonProps"
        >
            {{ isEdit ? "cancel" : "back" }}
        </BaseButton>
        <BaseButton
            :disabled="!canSubmit"
            variant="success"
            type="submit"
            :title="
                isEdit
                    ? `update book in ${props.shelfDisplayName} shelf`
                    : `add to ${props.shelfDisplayName} shelf`
            "
            v-bind="buttonProps"
        >
            {{ isEdit ? "update book" : "add to shelf" }}
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
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
    cancel: [];
}>();

const { mobile } = useDisplay();

const buttonProps = computed(() => {
    return {
        size: mobile.value ? "small" : "medium",
        style: mobile.value ? { width: "100%" } : {},
    };
});

const isEdit = computed(() => {
    return props.action === "update";
});
</script>

<style scoped>
.form-actions {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 1rem;
    margin-top: 1rem;
}

@media (max-width: 768px) {
    .form-actions {
        justify-content: space-between;
        width: 100%;
    }
}
</style>
