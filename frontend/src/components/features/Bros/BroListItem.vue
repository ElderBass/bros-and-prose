<template>
    <RouterLink
        :to="profileLink"
        class="bro-list-item-link"
        :class="{ 'is-logged-in-user': isLoggedInUser }"
    >
        <BaseCard
            :shadow-color="isLoggedInUser ? 'fuschia' : 'blue'"
            size="medium"
            :hoverable="true"
            class="bro-card"
        >
            <div class="bro-content">
                <AvatarImage
                    :avatar="user.avatar"
                    :avatarType="user.avatarType || 'icon'"
                    :size="mobile ? 'medium' : 'large'"
                />
                <div class="bro-info">
                    <h3 class="bro-username">
                        {{ isLoggedInUser ? "you" : `@${user.username}` }}
                    </h3>
                    <p class="bro-name">
                        {{ user.firstName?.toLowerCase() }}
                        {{ user.lastName?.toLowerCase() }}
                    </p>
                </div>
            </div>
        </BaseCard>
    </RouterLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useDisplay } from "vuetify";
import { storeToRefs } from "pinia";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import { useUserStore } from "@/stores/user";
import type { User } from "@/types";

const props = defineProps<{
    user: User;
}>();

const { mobile } = useDisplay();
const { loggedInUser } = storeToRefs(useUserStore());

const isLoggedInUser = computed(() => {
    return loggedInUser.value?.id === props.user.id;
});

const profileLink = computed(() => {
    return isLoggedInUser.value ? `/profile` : `/bros/${props.user.username}`;
});
</script>

<style scoped>
.bro-list-item-link {
    text-decoration: none;
    color: inherit;
    display: block;
    width: 100%;
}

.bro-list-item-link.is-logged-in-user {
    position: relative;
}

.bro-card {
    width: 100%;
    transition: all 0.3s ease;
}

.bro-list-item-link:hover .bro-card {
    transform: translateY(-4px);
}

.bro-content {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
}

.bro-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
}

.bro-username {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--accent-blue);
    font-family: "Libre Baskerville", serif;
}

.bro-list-item-link.is-logged-in-user .bro-username {
    color: var(--accent-fuschia);
    font-style: italic;
}

.bro-name {
    margin: 0;
    font-size: 1.125rem;
    color: var(--main-text);
    opacity: 0.85;
}

.bro-list-item-link.is-logged-in-user .bro-name {
    color: var(--accent-fuschia);
    opacity: 0.9;
}

@media (min-width: 768px) {
    .bro-content {
        gap: 2rem;
    }

    .bro-username {
        font-size: 1.75rem;
    }

    .bro-name {
        font-size: 1.25rem;
    }
}

@media (max-width: 767px) {
    .bro-content {
        gap: 1rem;
    }

    .bro-username {
        font-size: 1.25rem;
    }

    .bro-name {
        font-size: 1rem;
    }
}
</style>
