<template>
    <div class="form-actions">
        <BaseButton
            variant="outline-secondary"
            title="go back to search results"
            @click="closeModal"
            v-bind="buttonProps"
        >
            cancel
        </BaseButton>
        <BaseButton
            :disabled="!canSubmit"
            @click="submit"
            title="set the favs and fuck the gnaves"
            variant="primary"
            v-bind="buttonProps"
        >
            save favorites
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { useFavoritesModalStore } from "@/stores/favoritesModal";

defineProps<{
    canSubmit: boolean;
    submit: () => void;
}>();

defineEmits<{
    (e: "submit"): void;
}>();

const { mobile } = useDisplay();
const { closeModal } = useFavoritesModalStore();

const buttonProps = computed(() => {
    return {
        size: mobile.value ? "small" : "medium",
        style: mobile.value ? { width: "100%" } : {},
    };
});
</script>

<style scoped>
.form-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
}

@media (max-width: 768px) {
    .form-actions {
        justify-content: space-between;
        width: 100%;
    }
}
</style>
