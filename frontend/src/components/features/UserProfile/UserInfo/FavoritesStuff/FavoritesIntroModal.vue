<template>
    <BaseModal
        :modelValue="open"
        title="save your favs"
        :headerIcon="faHeart"
        shadow-color="pink"
        size="medium"
        @close="handleDismiss"
        @update:modelValue="handleDismiss"
    >
        <div class="intro-modal">
            <div class="intro-content">
                <h6 class="intro-heading">
                    add your favorite authors, genres, and books to god's plan
                </h6>
                <p class="intro-text">
                    save favorites to your profile - a golden opportunity to
                    convince the boys that you're more interesting and cultured
                    than you actually are.
                </p>
                <p class="intro-text-sub">wanna add some now?</p>
            </div>

            <div class="intro-actions">
                <BaseButton
                    variant="outline-error"
                    size="small"
                    @click="handleDismiss"
                >
                    <FontAwesomeIcon :icon="faHandMiddleFinger" />
                    fuck right off
                </BaseButton>
                <BaseButton
                    variant="outline-secondary"
                    color="yellow"
                    size="small"
                    @click="handleRemindLater"
                >
                    <FontAwesomeIcon :icon="faClock" />
                    remind me later
                </BaseButton>
                <BaseButton
                    variant="outline"
                    :size="mobile ? 'small' : 'medium'"
                    @click="handleAccept"
                >
                    <FontAwesomeIcon :icon="faHandPeace" />
                    hell yeah
                </BaseButton>
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import {
    faHeart,
    faHandMiddleFinger,
    faClock,
    faHandPeace,
} from "@fortawesome/free-solid-svg-icons";
import {
    markFavoritesIntroAsPermanentlyDismissed,
    setRemindMeLater,
} from "@/utils/favoritesIntroUtils";

defineProps<{
    open: boolean;
}>();

const emit = defineEmits<{
    (e: "accept"): void;
    (e: "dismiss"): void;
    (e: "remindLater"): void;
}>();

const { mobile } = useDisplay();

const handleAccept = () => {
    // Don't mark as completed yet - wait for wizard completion
    emit("accept");
};

const handleDismiss = () => {
    // Permanent dismissal - never show again
    markFavoritesIntroAsPermanentlyDismissed();
    emit("dismiss");
};

const handleRemindLater = () => {
    // Set timestamp, dismiss for 24 hours
    setRemindMeLater();
    emit("remindLater");
};
</script>

<style scoped>
.intro-modal {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;
}

.intro-content {
    height: 100%;
    display: flex;
    border: 1px solid var(--accent-pink);
    border-radius: 1rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    text-align: center;
}

.intro-heading {
    width: 50%;
    margin: 0 auto;
    text-align: center;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--accent-pink);
    margin: 0;
}

.intro-text {
    padding: 1rem;
    font-size: 1.05rem;
    line-height: 1.6;
    margin: 0;
    opacity: 0.9;
}

.intro-text-sub {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--accent-blue);
    margin: 0;
}

.intro-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: space-evenly;
    align-items: center;
}

@media (max-width: 768px) {
    .intro-text {
        font-size: 0.95rem;
    }
}
</style>
