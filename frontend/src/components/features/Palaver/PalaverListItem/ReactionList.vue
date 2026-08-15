<template>
    <div v-if="reaction.reactors.length" class="section">
        <span class="label">{{ reaction.emoji }} {{ reaction.label }} by:</span>
        <span
            v-for="(username, index) in reaction.reactors"
            :key="username"
            class="reaction-user"
        >
            {{ username === loggedInUser?.username ? "you" : `@${username}` }}
            <span v-if="index !== reaction.reactors.length - 1" class="comma"
                >,</span
            >
        </span>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { EmojiReactionBucket } from "@/types";
import { useUserStore } from "@/stores/user";

defineProps<{ reaction: EmojiReactionBucket }>();

const userStore = useUserStore();
const { loggedInUser } = storeToRefs(userStore);
</script>

<style scoped>
.section {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25rem;
    font-size: 1rem;
}

.label {
    font-weight: 400;
    color: var(--accent-blue);
}

.reaction-user {
    font-weight: 600;
    color: var(--accent-fuschia);
}

.comma {
    color: var(--main-text);
    margin-left: -0.2rem;
}
</style>
