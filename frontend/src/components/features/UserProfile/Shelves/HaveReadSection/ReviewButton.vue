<template>
    <BaseButton
        title="peep review"
        :size="mobile ? 'xsmall' : 'small'"
        :variant="buttonVariant"
        @click="$emit('click', $event)"
    >
        {{ rating }} / 10
    </BaseButton>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import BaseButton from "@/components/ui/BaseButton.vue";
import { getReviewColor } from "@/utils";

const props = defineProps<{
    rating: number;
}>();

defineEmits<{
    click: [event: MouseEvent];
}>();

const { mobile } = useDisplay();

const buttonVariant = computed(() => {
    switch (getReviewColor(props.rating ?? 0)) {
        case "red":
            return "outline-error";
        case "fuschia":
            return "outline-secondary";
        case "blue":
            return "outline";
        case "green":
            return "outline-success";
        default:
            return "outline";
    }
});
</script>
