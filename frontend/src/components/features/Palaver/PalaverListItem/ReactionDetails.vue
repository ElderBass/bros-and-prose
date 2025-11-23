<template>
    <div class="reaction-details">
        <ReactionList v-if="likes.length" type="like" :reactions="likes" />
        <ReactionList
            v-if="dislikes.length"
            type="dislike"
            :reactions="dislikes"
        />
    </div>
</template>

<script setup lang="ts">
import ReactionList from "./ReactionList.vue";

defineProps<{ likes: string[]; dislikes: string[] }>();
</script>

<style scoped>
.reaction-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.25rem;
}
</style>
