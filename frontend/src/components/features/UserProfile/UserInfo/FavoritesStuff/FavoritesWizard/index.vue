<template>
    <BaseModal
        :modelValue="open"
        title="save your favs"
        :headerIcon="faHeart"
        shadow-color="pink"
        size="large"
        @close="handleClose"
        @update:modelValue="handleClose"
    >
        <div class="wizard-container">
            <StepIndicator :currentStep="currentStep" :steps="steps" />

            <div class="wizard-content">
                <transition name="slide-fade" mode="out-in">
                    <component
                        :is="currentStepComponent"
                        :key="currentStep"
                        v-model="formData[currentStepKey]"
                        :authors="formData.authors"
                        :genres="formData.genres"
                        :books="formData.books"
                        @goToStep="goToStep"
                    />
                </transition>
            </div>

            <div class="wizard-actions">
                <BaseButton
                    v-if="currentStep > 1"
                    variant="outline-secondary"
                    :size="buttonSize"
                    @click="previousStep"
                >
                    back
                </BaseButton>

                <BaseButton
                    variant="outline-error"
                    :size="buttonSize"
                    @click="handleClose"
                >
                    cancel
                </BaseButton>

                <BaseButton
                    v-if="currentStep < steps.length"
                    variant="outline"
                    :size="buttonSize"
                    @click="nextStep"
                >
                    next
                </BaseButton>

                <BaseButton
                    v-else
                    variant="success"
                    :size="buttonSize"
                    :disabled="isSaving"
                    @click="handleComplete"
                >
                    {{ isSaving ? "saving..." : "send it" }}
                </BaseButton>
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, type Component } from "vue";
import { useDisplay } from "vuetify";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useUserFavorites } from "@/composables/useUserFavorites";
import { useUIStore } from "@/stores/ui";
import { QUICK_SUCCESS, QUICK_ERROR } from "@/constants/alerts";
import { markFavoritesIntroAsCompleted } from "@/utils/favoritesIntroUtils";
import StepIndicator from "./StepIndicator.vue";
import AuthorsStepForm from "./AuthorsStepForm.vue";
import GenresStepForm from "./GenresStepForm.vue";
import BooksStepForm from "./BooksStepForm.vue";
import ReviewStepForm from "./ReviewStepForm.vue";
import type { BookshelfBook } from "@/types";

defineOptions({
    name: "FavoritesWizard",
});

defineProps<{
    open: boolean;
}>();

const emit = defineEmits<{
    (e: "close"): void;
    (e: "complete"): void;
}>();

const currentStep = ref(1);
const isSaving = ref(false);

const steps = [
    { id: "authors", label: "authors" },
    { id: "genres", label: "genres" },
    { id: "books", label: "books" },
    { id: "review", label: "review" },
];

const formData = ref<{
    authors: string[];
    genres: string[];
    books: BookshelfBook[];
}>({
    authors: [],
    genres: [],
    books: [],
});

const components: Record<string, Component> = {
    authors: AuthorsStepForm,
    genres: GenresStepForm,
    books: BooksStepForm,
    review: ReviewStepForm,
};

const { mobile } = useDisplay();

const currentStepKey = computed(() => {
    return steps[currentStep.value - 1].id as keyof typeof formData.value;
});

const currentStepComponent = computed(() => {
    return components[currentStepKey.value];
});

const buttonSize = computed(() => {
    return mobile.value ? "small" : "medium";
});

const nextStep = () => {
    if (currentStep.value < steps.length) {
        currentStep.value++;
    }
};

const previousStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
};

const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
        currentStep.value = step;
    }
};

const handleComplete = async () => {
    isSaving.value = true;

    try {
        const userFavorites = useUserFavorites();

        // Update each type if there's data
        const promises = [];

        if (formData.value.authors.length > 0) {
            promises.push(
                userFavorites.updateFavorite("authors", formData.value.authors)
            );
        }

        if (formData.value.genres.length > 0) {
            promises.push(
                userFavorites.updateFavorite("genres", formData.value.genres)
            );
        }

        if (formData.value.books.length > 0) {
            promises.push(
                userFavorites.updateFavorite("books", formData.value.books)
            );
        }

        await Promise.all(promises);

        // Mark as completed in localStorage
        markFavoritesIntroAsCompleted();

        useUIStore().showAlert(
            QUICK_SUCCESS([
                "favorites saved!",
                "look at you, all personalized and shit",
            ])
        );

        emit("complete");
    } catch (error) {
        console.error("Error saving favorites:", error);
        useUIStore().showAlert(
            QUICK_ERROR([
                "couldn't save favorites",
                "try again or just give up, idk",
            ])
        );
    } finally {
        isSaving.value = false;
    }
};

const handleClose = () => {
    emit("close");
};
</script>

<style scoped>
.wizard-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;
}

.wizard-content {
    min-height: 400px;
    position: relative;
}

.wizard-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

/* Slide fade transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}

@media (max-width: 768px) {
    .wizard-content {
        min-height: 300px;
    }
}
</style>
