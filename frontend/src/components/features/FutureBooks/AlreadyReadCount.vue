<template>
    <v-tooltip :text="tooltipText" location="top">
        <template v-slot:activator="{ props }">
            <div class="already-read" v-bind="props">
                <span class="count">{{ alreadyReadCount }}</span>
                <span class="label">have read</span>
            </div>
        </template>
    </v-tooltip>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        alreadyReadCount: number;
        usernames: string[];
    }>(),
    {
        alreadyReadCount: 0,
        usernames: () => [],
    }
);

const addAndArticleToEndOfList = (list: string[]) => {
    return list.map((item, index) => {
        return `${item}${index === list.length - 1 ? "&" : ","}`;
    });
};

const tooltipText = computed(() => {
    const haveReadUsers = [...props.usernames].map((username) => {
        if (username === useUserStore().loggedInUser?.username) {
            return "you";
        }
        return username;
    });
    if (props.alreadyReadCount === 0) {
        return "no bro has previously perused this prose";
    }
    if (props.alreadyReadCount === 1) {
        if (haveReadUsers[0] === "you") {
            return "you have already read this, you twat";
        }
        return `${haveReadUsers[0]} has already read this, those wankers`;
    }
    return `${addAndArticleToEndOfList(haveReadUsers).join(" ")} have already read this`;
});
</script>

<style scoped>
.already-read {
    display: flex;
    align-items: baseline;
    gap: 0.375rem;
    font-size: 1.5rem;
    color: var(--accent-yellow);
    cursor: help;
}

.count {
    font-weight: 700;
    color: var(--accent-yellow);
}

.label {
    opacity: 0.8;
}
</style>
