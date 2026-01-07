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
        v-if="isLoggedInUser"
        variant="outline"
        title="recommend"
        @click="emit('recommend')"
        :size="buttonSize"
    >
        recommend
    </BaseButton>
    <MoveBookMenuButton
        v-else
        :book="book"
        :useIconButton="false"
        :buttonSize="buttonSize"
        :isLoggedInUser="isLoggedInUser"
    />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import BaseButton from "@/components/ui/BaseButton.vue";
import MoveBookMenuButton from "../../MoveBookMenuButton.vue";
import type { BookshelfBook } from "@/types";

defineProps<{
    book: BookshelfBook;
    isLoggedInUser: boolean;
}>();

const emit = defineEmits<{
    (e: "recommend"): void;
    (e: "close"): void;
}>();

const { mobile } = useDisplay();

const buttonSize = computed(() => (mobile.value ? "small" : "medium"));
</script>
