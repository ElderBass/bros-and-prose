<template>
    <span class="mention-text">
        <template v-for="(segment, index) in parsedSegments" :key="index">
            <UsernameLink
                v-if="segment.type === 'mention'"
                :username="segment.value"
                :fontSize="fontSize"
            />
            <span v-else>{{ segment.value }}</span>
        </template>
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import UsernameLink from "./UsernameLink.vue";
import { parseTextWithMentions } from "@/utils/mentionUtils";

const props = withDefaults(
    defineProps<{
        text: string;
        fontSize?: "small" | "medium" | "large";
    }>(),
    {
        fontSize: "small",
    }
);

const parsedSegments = computed(() => {
    return parseTextWithMentions(props.text);
});
</script>

<style scoped>
.mention-text {
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>
