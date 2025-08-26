<template>
    <div class="selectField">
        <label class="broSelectLabel" for="broNameSelect">
            which bro are you bro
        </label>
        <div class="selectWrapper">
            <select
                :value="modelValue"
                class="broSelect"
                id="broNameSelect"
                @input="
                    $emit(
                        'update:modelValue',
                        ($event.target as HTMLInputElement).value
                    )
                "
            >
                <option value="" class="nullOption">select a bro</option>
                <option value="Joel Braxton">Joel Braxton</option>
                <option value="Chris Dub">Chris Dub</option>
                <option value="Ken McGurran">Ken McGurran</option>
                <option value="Judd Prasnicky">Judd Prasnicky</option>
                <option value="Seth Zygarlicke">Seth Zygarlicke</option>
            </select>
            <div class="selectArrow">
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: string;
}>();

defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();
</script>

<style scoped>
.selectWrapper {
    position: relative;
    width: 100%;
}

.broSelectLabel {
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--accent-fuschia);
    margin-left: 0.5rem;
}

.broSelect {
    width: 100%;
    height: 4rem;
    background-color: var(--background-color);
    color: var(--main-text);
    border: 2px solid var(--accent-blue);
    border-radius: 0.5rem;
    padding: 0 1rem;
    font-family: "Crimson Text", serif;
    font-size: 1.5rem;
    font-weight: 400;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    /* Add padding for custom arrow */
    padding-right: 3rem;
}

.selectArrow {
    position: absolute;
    right: 1rem;
    top: 55%;
    transform: translateY(-50%);
    color: var(--accent-blue);
    pointer-events: none;
    transition: color 0.3s ease;
}

.broSelect:focus {
    border: 2px solid var(--accent-lavender);
    outline: none;
}

.broSelect:focus + .selectArrow {
    color: var(--accent-lavender);
}

.nullOption {
    opacity: 0.5;
}
</style>
