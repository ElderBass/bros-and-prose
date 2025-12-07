<template>
    <BaseModal
        :modelValue="open"
        @close="onClose"
        title="sucks to suck"
        :size="modalSize"
        shadowColor="red"
        :headerIcon="faHandMiddleFinger"
    >
        <div class="success-modal-content">
            <slot />
        </div>
        <template #footer>
            <BaseButton variant="outline-error" @click="onClose">
                get fucked
            </BaseButton>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { faHandMiddleFinger } from "@fortawesome/free-solid-svg-icons";

const { mobile } = useDisplay();

defineProps<{
    open: boolean;
}>();

const emit = defineEmits<{
    (e: "close"): void;
}>();

const onClose = () => {
    emit("close");
};

const modalSize = computed(() => {
    return mobile.value ? "small" : "medium";
});
</script>

<style scoped>
.success-modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 4rem;
    height: 100%;
    width: 100%;
}
</style>
