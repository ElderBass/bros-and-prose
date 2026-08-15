<template>
    <div class="reaction-details">
        <EmojiReactionPills
            :item="entry"
            size="small"
            :clickable="clickable"
            @select="emit('select', $event)"
        />
    </div>
</template>

<script setup lang="ts">
import EmojiReactionPills from "@/components/features/common/EmojiReactionPills.vue";
import type { EmojiReactionKey, PalaverEntry } from "@/types";

defineProps<{
    entry: PalaverEntry;
    clickable?: boolean;
}>();

const emit = defineEmits<{
    (e: "select", reactionKey: EmojiReactionKey): void;
}>();
</script>

<style scoped>
.reaction-details {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem;
}
</style>
