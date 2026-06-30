<template>
    <v-menu
        v-if="canShowHoverCard && user"
        v-model="menuOpen"
        :open-on-hover="true"
        :open-on-click="false"
        :close-on-content-click="true"
        location="bottom"
        :offset="8"
        content-class="username-link-menu-overlay"
        transition="scale-transition"
    >
        <template #activator="{ props: menuActivatorProps }">
            <RouterLink
                v-bind="menuActivatorProps"
                class="router-link-wrapper username-link"
                :class="`font-size-${fontSize}`"
                :to="profilePath"
            >
                @{{ username }}
            </RouterLink>
        </template>
        <UserHoverCard :user="user" />
    </v-menu>
    <RouterLink
        v-else
        class="router-link-wrapper username-link"
        :class="`font-size-${fontSize}`"
        :to="profilePath"
    >
        @{{ username }}
    </RouterLink>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/stores/user";
import UserHoverCard from "./UserHoverCard.vue";

const props = withDefaults(
    defineProps<{
        username: string;
        fontSize?: "small" | "medium" | "large";
        showHoverCard?: boolean;
    }>(),
    {
        fontSize: "small",
        showHoverCard: true,
    }
);

const { mobile } = useDisplay();
const userStore = useUserStore();
const menuOpen = ref(false);

const user = computed(() => userStore.getUserByUsername(props.username));
const profilePath = computed(() => `/bros/${props.username}`);
const canShowHoverCard = computed(
    () => props.showHoverCard && !mobile.value && !!user.value
);
</script>

<style scoped>
.username-link {
    color: var(--accent-fuschia);
    text-decoration: none;
    font-weight: 600;
}

.username-link:hover {
    text-decoration: underline;
}

.username-link.font-size-small {
    font-size: 1rem;
}

.username-link.font-size-medium {
    font-size: 1.25rem;
}

.username-link.font-size-large {
    font-size: 1.5rem;
}
</style>

<style>
.username-link-menu-overlay {
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}
</style>
