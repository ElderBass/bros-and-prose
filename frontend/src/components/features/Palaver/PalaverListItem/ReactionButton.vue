<template>
    <div class="button-wrapper">
        <IconButton
            :icon="type === 'like' ? faThumbsUp : faThumbsDown"
            :size="buttonSize"
            :title="title"
            :handleClick="onClick"
            :disabled="userHasReacted"
            :color="color"
        />
        <ReactionCountBadge :count="reactionCount" :color="color" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@/components/ui/IconButton.vue";
import ReactionCountBadge from "./ReactionCountBadge.vue";
import type { ReactionType } from "@/types";

const props = defineProps<{
    type: ReactionType;
    reactions: string[];
    onClick: () => void;
}>();

const { mobile } = useDisplay();
const userStore = useUserStore();

const { loggedInUser } = storeToRefs(userStore);

const userHasReacted = computed(() => {
    return props.reactions.includes(loggedInUser.value?.username);
});

const reactionCount = computed(() => {
    return props.reactions.length;
});

const title = computed(() => {
    if (props.type === "like") {
        return userHasReacted.value
            ? "you can\'t like that shit again, idiot"
            : "you like that shit??";
    } else {
        return userHasReacted.value
            ? "i mean i know it sucks but c\'mon man"
            : "shit\'s weak";
    }
});

const color = computed(() => {
    return props.type === "like" ? "green" : "red";
});

const buttonSize = computed(() => {
    return mobile.value ? "xsmall" : "small";
});
</script>
