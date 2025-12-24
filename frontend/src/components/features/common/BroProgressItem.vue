<template>
    <div class="other-bro-progress-item">
        <div class="bro-avatar-container">
            <AvatarImage
                :icon="props.broAvatar"
                :size="mobile ? 'xsmall' : 'small'"
            />
            <p v-if="isLoggedInUser" class="isLoggedInUser">you</p>
            <UsernameLink
                v-else
                :username="props.broName"
                :fontSize="mobile ? 'small' : 'medium'"
            />
        </div>
        <div class="progress-value-container">
            <p :class="{ finished: props.hasFinished }" class="progress-value">
                {{ props.progressString }}
            </p>
            <BaseButton
                v-if="props.hasFinished"
                @click="props.onPeepReviewClick"
                size="xsmall"
                :variant="isLoggedInUser ? 'outline' : 'outline-tertiary'"
                :title="buttonTitle"
                :disabled="!hasFinishedCurrentBook()"
            >
                <div class="button-content">
                    <FontAwesomeIcon v-if="isLoggedInUser" :icon="faMarker" />
                    <FontAwesomeIcon v-else :icon="faGlasses" />
                    <span>review</span>
                </div>
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import { faGlasses, faMarker } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import UsernameLink from "@/components/ui/UsernameLink.vue";
import { hasFinishedCurrentBook } from "@/utils";

const props = withDefaults(
    defineProps<{
        broName: string;
        broAvatar: IconDefinition;
        hasFinished: boolean;
        progressString: string;
        onPeepReviewClick: () => void;
        isLoggedInUser?: boolean;
    }>(),
    {
        isLoggedInUser: false,
    }
);

const { mobile } = useDisplay();

const buttonTitle = computed(() => {
    return props.isLoggedInUser
        ? "you can't fix stupid, but I suppose you can try"
        : "peep this bro's review which is probably way smarter than yours";
});
</script>

<style scoped>
.other-bro-progress-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.bro-avatar-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.progress-value-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 0.5rem;
}

p {
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--accent-fuschia);
}

.progress-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--main-text);
    text-align: right;
}

.finished {
    color: var(--accent-blue);
}

.isLoggedInUser {
    color: var(--accent-green);
    font-weight: 600;
    font-size: 1.25rem;
}

.button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

@media (max-width: 768px) {
    p {
        font-size: 1.125rem;
    }

    .progress-value {
        font-size: 1rem;
    }
}
</style>
