<template>
    <BaseButton
        variant="outline-secondary"
        title="close"
        @click="emit('close')"
        :size="buttonSize"
    >
        close
    </BaseButton>
    <BaseButton
        variant="outline"
        title="recommend"
        @click="emit('recommend')"
        :size="buttonSize"
    >
        recommend
    </BaseButton>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import BaseButton from "@/components/ui/BaseButton.vue";

defineProps<{
    showRecommend: boolean;
}>();

const emit = defineEmits<{
    (e: "recommend"): void;
    (e: "close"): void;
}>();

const { mobile } = useDisplay();

const buttonSize = computed(() => (mobile.value ? "small" : "medium"));
</script>
