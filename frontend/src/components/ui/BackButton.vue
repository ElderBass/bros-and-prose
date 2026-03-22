<template>
    <IconButton
        :icon="faArrowLeft"
        :size="buttonSize"
        :title="title"
        :handleClick="onClick"
    />
</template>

<script setup lang="ts">
import { useRouter, type RouteLocationRaw } from "vue-router";
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const props = defineProps<{
    title: string;
    canGoBack: boolean;
    fallbackTo?: RouteLocationRaw;
}>();

const router = useRouter();
const { mobile } = useDisplay();

const onClick = () => {
    if (props.canGoBack) {
        router.back();
    } else if (props.fallbackTo !== undefined) {
        router.push(props.fallbackTo);
    }
};

const buttonSize = computed(() => {
    return mobile.value ? "xsmall" : "small";
});
</script>
