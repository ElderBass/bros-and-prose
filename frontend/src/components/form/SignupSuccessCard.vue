<template>
    <div class="success-card-container">
        <h1>welcome to the club</h1>
        <BaseCard size="medium" shadowColor="blue">
            <h2>real bros read prose</h2>
            <div class="prose-container">
                <p>they said it couldn't be done.</p>
                <p>they said bros aren't well read.</p>
                <p>they said reading isn't fun.</p>
                <p>they said all my friends are dead.</p>
            </div>
            <p class="purple">they were wrong.</p>
            <div v-if="!isGuestUser()" class="button-container">
                <BaseButton
                    title="proceed with God's Plan"
                    variant="outline-secondary"
                    :size="buttonSize"
                    @click="onProceedClick"
                >
                    <div class="button-content">
                        <span>proceed with God's plan</span>
                        <FontAwesomeIcon icon="fa-solid fa-book-bible" />
                    </div>
                </BaseButton>
            </div>
        </BaseCard>
    </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { computed } from "vue";
import { isGuestUser } from "@/utils";

defineProps<{
    onProceedClick?: () => void;
}>();

const { mobile } = useDisplay();

const buttonSize = computed(() => {
    return mobile.value ? "small" : "medium";
});
</script>

<style scoped>
.success-card-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
}

h1 {
    text-align: center;
    font-size: 1.75rem;
    color: var(--accent-fuschia);
}

h2 {
    color: var(--accent-blue);
    font-size: 1.5rem;
    text-align: left;
}

p {
    color: var(--main-text);
    font-size: 1.25rem;
}

.purple {
    text-align: center;
    font-size: 1.5rem;
    color: var(--accent-lavender);
}

.prose-container {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.button-container {
    width: 100%;
    display: flex;
    justify-content: center;
}

.button-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
}

@media (max-width: 768px) {
    .success-card-container {
        gap: 1rem;
    }

    h1 {
        font-size: 1.5rem;
    }

    h2 {
        font-size: 1.25rem;
    }

    p {
        font-size: 1rem;
    }

    .purple {
        font-size: 1.125rem;
    }
}
</style>
