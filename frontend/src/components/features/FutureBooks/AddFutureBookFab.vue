<template>
    <FloatingActionButton
        :icon="faBookMedical"
        title="add a future book"
        @click="() => $emit('click')"
        :disabled="disabled"
    />
</template>

<script setup lang="ts">
import { faBookMedical } from "@fortawesome/free-solid-svg-icons";

defineProps<{
    disabled: boolean;
}>();
</script>
