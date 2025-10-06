<template>
    <div class="add-future-book-fab">
        <IconButton
            color="green"
            :icon="faBookMedical"
            title="add a future book"
            size="large"
            :handleClick="() => $emit('click')"
        />
    </div>
</template>

<script setup lang="ts">
import { faBookMedical } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@/components/ui/IconButton.vue";
</script>

<style scoped>
.add-future-book-fab {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
}
</style>
