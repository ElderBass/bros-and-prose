<template>
    <div class="reaction-details">
        <ReactionList
            v-for="reaction in reactionBuckets"
            :key="reaction.key"
            :reaction="reaction"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ReactionList from "./ReactionList.vue";
import type { PalaverEntry } from "@/types";
import { getVisibleReactionBuckets } from "@/utils";

const props = defineProps<{ entry: PalaverEntry }>();

const reactionBuckets = computed(() => getVisibleReactionBuckets(props.entry));
</script>

<style scoped>
.reaction-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.25rem;
}
</style>
