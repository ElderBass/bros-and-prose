<template>
    <BaseModal
        :modelValue="open"
        @close="onClose"
        title="change ur username"
        size="small"
    >
        <form class="username-form" @submit.prevent="onConfirm">
            <div class="field">
                <label for="username-input">new name who dis</label>
                <BaseInput
                    id="username-input"
                    v-model="localUsername"
                    label="username"
                    placeholder="enter a new handle"
                    type="text"
                    :size="mobile ? 'medium' : 'large'"
                />
                <p class="hint" v-if="validationMessage">
                    {{ validationMessage }}
                </p>
            </div>

            <div class="actions">
                <BaseButton
                    variant="outline-secondary"
                    @click="onClose"
                    title="fucking coward"
                    v-bind="buttonProps"
                    >cancel</BaseButton
                >
                <BaseButton
                    variant="outline"
                    type="submit"
                    :disabled="!canSubmit"
                    title="send that silly shit, bro"
                    v-bind="buttonProps"
                    >update</BaseButton
                >
            </div>
        </form>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useDisplay } from "vuetify";

const emit = defineEmits<{
    (e: "close"): void;
    (e: "confirm", value: string): void;
}>();

const props = defineProps<{
    open: boolean;
    currentUsername: string;
}>();

const { mobile } = useDisplay();

const localUsername = ref(props.currentUsername);

const buttonProps = computed(() => {
    return {
        size: mobile.value ? "small" : "medium",
        style: { width: "100%" },
    };
});

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            localUsername.value = props.currentUsername;
        }
    }
);

const isUnchanged = computed(
    () => localUsername.value.trim() === props.currentUsername.trim()
);
const isValid = computed(() =>
    /^[A-Za-z0-9_]{3,20}$/.test(localUsername.value.trim())
);

const validationMessage = computed(() => {
    if (localUsername.value.trim().length === 0) return "username is required";
    if (!/^[A-Za-z0-9_]+$/.test(localUsername.value.trim()))
        return "only letters, numbers, and underscores";
    if (localUsername.value.trim().length < 3) return "minimum 3 characters";
    if (localUsername.value.trim().length > 20) return "maximum 20 characters";
    return "";
});

const canSubmit = computed(() => isValid.value && !isUnchanged.value);

const onClose = () => emit("close");
const onConfirm = () => emit("confirm", localUsername.value.trim());
</script>

<style scoped>
.username-form {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    padding-left: 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    opacity: 0.9;
    color: var(--accent-lavender);
}

.hint {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.75;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 0.5rem;
}

@media (max-width: 768px) {
    .username-form {
        padding: 0.5rem;
    }

    label {
        font-size: 1.25rem;
    }

    .hint {
        font-size: 0.875rem;
    }

    .actions {
        justify-content: space-between;
        gap: 0.5rem;
    }
}
</style>
