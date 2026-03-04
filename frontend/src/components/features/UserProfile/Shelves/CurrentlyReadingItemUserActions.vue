<template>
    <div class="actions">
        <BaseButton
            title="recommend that shit ferda"
            variant="outline"
            v-bind="buttonProps"
            @click="handleRecommend"
        >
            <FontAwesomeIcon :icon="faHandPeace" />
            recommend
        </BaseButton>
        <BaseButton
            title="wherein the present now becomes the past"
            variant="outline-success"
            v-bind="buttonProps"
            @click="handleFinished"
        >
            <FontAwesomeIcon :icon="faCircleCheck" />
            finish
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { BookshelfBook } from "@/types";
import { useUserShelves } from "@/composables/useUserShelves";
import { recommendBook } from "@/utils";
import { faHandPeace, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps<{
    book: BookshelfBook;
}>();

const { mobile } = useDisplay();
const { finishCurrentlyReading } = useUserShelves();

const buttonProps = computed(() => {
    return {
        size: mobile.value ? "xsmall" : "small",
        style: { width: "100%" },
    };
});

const handleFinished = async () => {
    await finishCurrentlyReading(props.book.id);
};

const handleRecommend = () => recommendBook(props.book);
</script>

<style scoped>
.actions {
    padding: 0.5rem 1rem;
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
    align-items: center;
}
</style>
