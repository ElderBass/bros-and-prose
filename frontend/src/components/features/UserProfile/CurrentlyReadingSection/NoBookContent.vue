<template>
    <div class="empty">
        <p class="empty-title">
            {{ isLoggedInUser ? "you" : "they" }} ain't reading shit
        </p>
        <p v-if="!isLoggedInUser" class="empty-subtitle">
            probably barely can keep up with the current prose ferda bros
        </p>
        <BaseButton
            v-else
            :size="mobile ? 'small' : 'medium'"
            variant="success"
            @click="openAddBook('currentlyReading')"
            title="toss something in “currently reading” from the shelf modal"
        >
            <FontAwesomeIcon :icon="faBookOpenReader" />
            fix that
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { useShelfModalStore } from "@/stores/shelfModal";
import { faBookOpenReader } from "@fortawesome/free-solid-svg-icons";

const shelfModalStore = useShelfModalStore();
const { openAddBook } = shelfModalStore;
const { mobile } = useDisplay();

defineProps<{
    isLoggedInUser: boolean;
}>();
</script>

<style scoped>
.empty {
    flex: 1;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 1rem;
    border: 2px dashed var(--accent-blue);
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 12px rgba(0, 191, 255, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.empty-title {
    margin: 0;
    font-weight: 600;
    color: var(--accent-blue);
}

.empty-subtitle {
    margin: 0;
    text-align: center;
    color: var(--main-text);
    opacity: 0.85;
    font-style: italic;
}
</style>
