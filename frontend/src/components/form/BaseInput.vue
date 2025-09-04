<template>
    <div class="base-input-container">
        <input
            class="base-input"
            :class="`size-${size}`"
            :value="modelValue"
            @input="
                $emit(
                    'update:modelValue',
                    ($event.target as HTMLInputElement).value
                )
            "
            :aria-label="label"
            :placeholder="placeholder"
            :type="inputType"
            :disabled="disabled"
            :prepend-inner-icon="prependInnerIcon"
        />
        <button
            type="button"
            v-if="isPassword"
            class="password-toggle"
            @click="showingPassword = !showingPassword"
        >
            <FontAwesomeIcon
                :icon="passwordIcon"
                class="password-toggle-icon"
            />
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const props = withDefaults(
    defineProps<{
        modelValue: string;
        label: string;
        placeholder: string;
        type: string;
        disabled?: boolean;
        prependInnerIcon?: string;
        size?: "small" | "medium" | "large";
    }>(),
    {
        disabled: false,
        prependInnerIcon: "",
        size: "large",
    }
);

defineEmits<{
    "update:modelValue": [value: string];
}>();

const isPassword = computed(() => props.type === "password");

const showingPassword = ref(false);

const passwordIcon = computed(() => {
    return isPassword.value && showingPassword.value ? faEyeSlash : faEye;
});

const inputType = computed(() => {
    return isPassword.value && showingPassword.value ? "text" : props.type;
});
</script>

<style scoped>
.base-input-container {
    position: relative;
}

.base-input {
    width: 100%;
    background-color: var(--background-color);
    color: var(--main-text);
    border: 2px solid var(--accent-blue);
    border-radius: 0.5rem;
    font-family: "Crimson Text", serif;
    font-weight: 400;

    &::placeholder {
        color: var(--main-text);
        opacity: 0.6;
    }

    &:focus {
        outline: none;
        border: 2px solid var(--accent-lavender);
    }
}

/* Size variants */
.base-input.size-small {
    height: 2.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
}

.base-input.size-medium {
    height: 3rem;
    padding: 0.75rem 1rem;
    font-size: 1.25rem;
}

.base-input.size-large {
    height: 4rem;
    padding: 1rem;
    font-size: 1.75rem;
}
.has-toggle .base-input {
    padding-right: 4rem;
}

.base-input::placeholder {
    color: var(--main-text);
    opacity: 0.6;
}

.base-input:focus {
    outline: none;
    border: 2px solid var(--accent-lavender);
}

.password-toggle {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--accent-blue);
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease;

    svg {
        fill: var(--accent-blue);
    }
}

.password-toggle-icon {
    fill: var(--accent-blue);
    width: 1.5rem;
    height: 1.5rem;
}

/* Size-specific password toggle icons */
.size-small ~ .password-toggle .password-toggle-icon {
    width: 1rem;
    height: 1rem;
}

.size-medium ~ .password-toggle .password-toggle-icon {
    width: 1.25rem;
    height: 1.25rem;
}

.size-large ~ .password-toggle .password-toggle-icon {
    width: 1.5rem;
    height: 1.5rem;
}

.password-toggle:hover {
    color: var(--accent-lavender);
}

.password-toggle:focus {
    outline: 2px solid var(--accent-lavender);
    outline-offset: 2px;
    border-radius: 0.25rem;
}

/* Ensure the button doesn't interfere with input focus */
.password-toggle:focus {
    z-index: 1;
}
</style>
