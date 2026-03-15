<template>
    <IconButton
        :icon="faArrowLeft"
        :size="buttonSize"
        :title="title"
        :handleClick="goBack"
    />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

defineProps<{
    title: string;
}>();

const router = useRouter();
const { mobile } = useDisplay();

const goBack = () => router.back();

const buttonSize = computed(() => {
    return mobile.value ? "xsmall" : "small";
});
</script>
