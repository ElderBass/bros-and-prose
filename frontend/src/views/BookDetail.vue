<template>
    <AppLayout>
        <h1>Book Detail</h1>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from "../components/layout/AppLayout.vue";
import { onMounted } from "vue";

const props = defineProps<{
    bookId: string;
}>();

onMounted(() => {
    console.log(props.bookId);
    // add API call here to get the book details using bookId
});
</script>
