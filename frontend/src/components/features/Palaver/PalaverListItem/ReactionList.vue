<template>
    <div v-if="reactions.length" class="section">
        <span class="label" :class="color">{{ label }} by:</span>
        <div v-for="(username, index) in reactions" :key="username">
            <span class="reaction-user">
                {{
                    username === loggedInUser?.username ? "you" : `@${username}`
                }}
                <span v-if="index !== reactions.length - 1" class="comma"
                    >,</span
                >
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import type { ReactionType } from "@/types";
import { useUserStore } from "@/stores/user";

const props = defineProps<{ type: ReactionType; reactions: string[] }>();

const userStore = useUserStore();
const { loggedInUser } = storeToRefs(userStore);

const label = computed(() => {
    return props.type === "like" ? "liked" : "disliked";
});

const color = computed(() => {
    return props.type === "like" ? "green" : "red";
});
</script>

<style scoped>
.section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
}

.label {
    font-weight: 400;
}

.green {
    color: var(--accent-green);
}

.red {
    color: var(--accent-red);
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
