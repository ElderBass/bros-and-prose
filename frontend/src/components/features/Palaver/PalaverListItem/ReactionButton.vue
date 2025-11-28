<template>
    <div class="button-wrapper">
        <IconButton
            :icon="icon"
            :size="buttonSize"
            :title="title"
            :handleClick="onClick"
            :disabled="userHasReacted"
            :color="color"
        />
        <ReactionCountBadge
            :count="reactionCount"
            :color="color"
            :isChildComment="isChildComment"
        />
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

const props = withDefaults(
    defineProps<{
        type: ReactionType;
        reactions: string[];
        onClick: () => void;
        isChildComment?: boolean;
    }>(),
    {
        isChildComment: false,
    }
);

const { mobile } = useDisplay();
const userStore = useUserStore();

const { loggedInUser } = storeToRefs(userStore);

const userHasReacted = computed(() => {
    return props.reactions.includes(loggedInUser.value?.username);
});

const reactionCount = computed(() => {
    return props.reactions.length;
});

const icon = computed(() => {
    return props.type === "like" ? faThumbsUp : faThumbsDown;
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
    return props.isChildComment
        ? "supersmall"
        : mobile.value
          ? "xsmall"
          : "small";
});
</script>

<style scoped>
.button-wrapper {
    position: relative;
}
</style>
