<template>
    <ProseCommentsSectionV2
        v-if="useV2ProseComments"
        ref="v2Ref"
        :entry="entry"
        @entry-updated="(e) => emit('entry-updated', e)"
    />
    <ProseCommentsSectionV1
        v-else
        :entry="entry"
        @entry-updated="(e) => emit('entry-updated', e)"
    />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ProseEntry } from "@/types";
import { useV2ProseComments } from "@/constants/features";
import ProseCommentsSectionV1 from "./ProseCommentsSectionV1.vue";
import ProseCommentsSectionV2 from "./ProseCommentsSectionV2.vue";

defineProps<{
    entry: ProseEntry;
}>();
const emit = defineEmits<{
    "entry-updated": [entry: ProseEntry];
}>();

const v2Ref = ref<InstanceType<typeof ProseCommentsSectionV2> | null>(null);

defineExpose({
    openComposer() {
        v2Ref.value?.openComposer();
    },
});
</script>
