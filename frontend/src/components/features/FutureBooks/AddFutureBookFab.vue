<template>
    <FloatingActionButton
        :icon="faBookMedical"
        title="add a future book"
        @click="() => $emit('click')"
    />
</template>

<script setup lang="ts">
import { faBookMedical } from "@fortawesome/free-solid-svg-icons";
</script>
