<template>
    <span class="name-list">
        <template v-for="(name, i) in shownNames" :key="name">
            <span v-if="i > 0" class="name-sep">, </span>
            <span v-if="name === myUsername" class="name-you">you</span>
            <UsernameLink
                v-else
                :username="name"
                fontSize="small"
                :showHoverCard="false"
            />
        </template>
        <span v-if="overflowCount > 0" class="name-more">
            +{{ overflowCount }} more
        </span>
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import UsernameLink from "@/components/ui/UsernameLink.vue";
import { useUserStore } from "@/stores/user";

const props = withDefaults(
    defineProps<{
        names: string[];
        max?: number;
    }>(),
    {
        max: 6,
    }
);

const { loggedInUser } = storeToRefs(useUserStore());

const myUsername = computed(() => loggedInUser.value?.username);

const sortedNames = computed(() =>
    [...props.names].sort((a, b) => {
        if (a === myUsername.value) return -1;
        if (b === myUsername.value) return 1;
        return a.localeCompare(b, undefined, { sensitivity: "base" });
    })
);

const shownNames = computed(() => sortedNames.value.slice(0, props.max));
const overflowCount = computed(
    () => sortedNames.value.length - shownNames.value.length
);
</script>

<style scoped>
.name-list {
    min-width: 0;
}

.name-list :deep(.username-link) {
    font-size: 0.9rem;
}

.name-you {
    color: var(--accent-fuschia);
    font-weight: 600;
}

.name-sep,
.name-more {
    opacity: 0.7;
}

.name-more {
    margin-left: 0.3rem;
}
</style>
