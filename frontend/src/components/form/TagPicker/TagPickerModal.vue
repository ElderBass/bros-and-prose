<template>
    <BaseModal
        :modelValue="open"
        @close="emit('close')"
        @update:modelValue="(v: boolean) => !v && emit('close')"
        title="pick tags"
        size="large"
        shadow-color="blue"
    >
        <div class="wrap">
            <TagPickerPanel
                :allTags="allTags"
                :initialTags="modelValue"
                title="add tags"
                @cancel="emit('close')"
                @done="(tags) => emit('update:modelValue', tags)"
            />
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import TagPickerPanel from "./TagPickerPanel.vue";

defineProps<{
    open: boolean;
    modelValue: string[];
    allTags: string[];
}>();

const emit = defineEmits<{
    (e: "close"): void;
    (e: "update:modelValue", value: string[]): void;
}>();
</script>

<style scoped>
.wrap {
    width: 100%;
}
</style>
