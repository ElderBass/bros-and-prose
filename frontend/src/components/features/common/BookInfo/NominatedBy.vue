<template>
    <div class="nominated-by">
        <p :class="labelClass">nominated by</p>
        <UsernameLink
            :username="nominatorUsername"
            :fontSize="isLink ? 'small' : 'large'"
        />
    </div>
</template>

<script setup lang="ts">
import type { Book } from "@/types";
import { computed } from "vue";
import { getBookNominatorUsername } from "@/utils";
import UsernameLink from "@/components/ui/UsernameLink.vue";

const props = defineProps<{
    book: Book;
    isLink?: boolean;
}>();

const nominatorUsername = computed(() => {
    return getBookNominatorUsername(props.book) || "some shmuck";
});

const labelClass = computed(() => {
    return props.isLink ? "link-nominated-by" : "default";
});
</script>

<style scoped>
.nominated-by {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    align-items: center;
}

.default {
    font-size: 0.85rem;
}

.link-nominated-by {
    font-size: 1rem;
}

@media (min-width: 768px) {
    .default {
        font-size: 1.5rem;
    }
    .link-nominated-by {
        font-size: 1rem;
    }
}
</style>
