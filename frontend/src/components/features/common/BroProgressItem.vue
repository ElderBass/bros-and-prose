<template>
    <div class="other-bro-progress-item">
        <div class="bro-avatar-container">
            <AvatarImage
                :icon="props.broAvatar"
                :size="isMobile ? 'xsmall' : 'small'"
            />
            <p :class="{ isLoggedInUser }">
                {{ isLoggedInUser ? "you" : props.broName }}
            </p>
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
import { defineProps, withDefaults, computed } from "vue";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import { faGlasses, faMarker } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";

const { isMobile } = storeToRefs(useUIStore());

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
    color: var(--main-text);
}

.progress-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--accent-lavender);
}

.finished {
    color: var(--accent-fuschia);
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
