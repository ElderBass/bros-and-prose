<template>
    <BaseModal
        :modelValue="open"
        @close="onClose"
        title="pick ur vibe, bro"
        size="large"
    >
        <div class="modal-content">
            <div class="selector-container">
                <AvatarSelector
                    v-model="localAvatar"
                    :currentAvatar="currentAvatar"
                />
            </div>
            <div class="actions">
                <BaseButton
                    variant="outline-secondary"
                    @click="onClose"
                    v-bind="buttonProps"
                    >cancel</BaseButton
                >
                <BaseButton
                    variant="outline"
                    @click="onConfirm"
                    :disabled="!localAvatar || localAvatar === currentAvatar"
                    v-bind="buttonProps"
                    >update</BaseButton
                >
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useDisplay } from "vuetify";
import AvatarSelector from "@/components/features/UserProfile/AvatarSelector.vue";

const emit = defineEmits<{
    (e: "close"): void;
    (e: "confirm", value: string): void;
}>();

const props = defineProps<{
    open: boolean;
    currentAvatar: string;
}>();

const { mobile } = useDisplay();

const localAvatar = ref(props.currentAvatar);

const buttonProps = computed(() => {
    return {
        size: mobile.value ? "small" : "medium",
        style: { width: mobile.value ? "100%" : "75%" },
    };
});

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            localAvatar.value = props.currentAvatar;
        }
    }
);

const onClose = () => emit("close");
const onConfirm = () => emit("confirm", localAvatar.value);
</script>

<style scoped>
.modal-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.selector-container {
    max-height: 60vh;
    overflow: auto;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
    align-self: end;
    width: 75%;
}

@media (max-width: 768px) {
    .actions {
        justify-content: space-between;
        width: 100%;
        align-self: center;
    }
}
</style>
