<template>
    <div class="currently-reading-book-item">
        <!-- Book Details Section -->
        <div class="book-details">
            <div class="cover-and-info">
                <BookCover :imageSrc="book.imageSrc" :title="book.title" />

                <div class="info">
                    <div class="title-container">
                        <h3 class="title">{{ book.title }}</h3>
                        <BookshelfBookListItemActions
                            v-if="isLoggedInUser"
                            :isLoggedInUser="isLoggedInUser"
                            :book="book"
                            shelf="currentlyReading"
                        />
                    </div>

                    <BookMetadata
                        :author="book.author"
                        :yearPublished="book.yearPublished"
                        :pages="book.pages"
                    />

                    <TagsContainer :tags="book.tags" />
                </div>
            </div>

            <BlurbAndDescription
                :blurb="book.userBlurb"
                :description="book.description"
                :showDescription="false"
            />
        </div>

        <!-- Progress Section (only if book has pages and user is logged in) -->
        <div v-if="showProgressSection" class="progress-section">
            <div class="user-progress">
                <div class="progress-info">
                    <ElementSwap>
                        <span
                            v-if="!updateModeEnabled"
                            key="display"
                            class="progress-page-info"
                        >
                            page {{ updatedProgress }}
                        </span>
                        <BaseInput
                            v-else
                            key="input"
                            v-model="updatedProgress"
                            id="manual-progress-input"
                            @update:modelValue="handleProgressChange"
                            :size="mobile ? 'small' : 'medium'"
                            label="current page"
                            :placeholder="updatedProgress.toString()"
                            type="number"
                            :style="inputStyle"
                            containerStyle="width: auto"
                        />
                    </ElementSwap>
                    <span class="progress-page-info"> / {{ book.pages }} </span>
                </div>
                <ProgressSliderInput
                    :progress="updatedProgress"
                    :maxPages="book.pages!"
                    @progressChange="handleProgressChange"
                    :disabled="!updateModeEnabled"
                />
                <span class="progress-percentage">
                    {{ userPercentage }}% complete
                </span>
            </div>
            <div class="progress-actions">
                <BaseButton
                    v-if="!updateModeEnabled"
                    @click="handleFinished"
                    variant="outline-success"
                    title="wherein the present now becomes the past"
                    v-bind="buttonProps"
                >
                    <FontAwesomeIcon :icon="faCircleCheck" />
                    <span>finished</span>
                </BaseButton>
                <BaseButton
                    v-if="updateModeEnabled"
                    @click="onCancelClick"
                    variant="outline-secondary"
                    title="cancel this shitty progress update"
                    v-bind="buttonProps"
                >
                    <span>cancel</span>
                </BaseButton>
                <BaseButton
                    @click="onUpdateClick"
                    :variant="updateButtonConfig.variant"
                    title="prove you can read and update your progress"
                    v-bind="buttonProps"
                >
                    <span>{{ updateButtonConfig.label }}</span>
                </BaseButton>
            </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="isLoggedInUser" class="actions">
            <BaseButton
                title="recommend that shit ferda"
                variant="outline-warning"
                v-bind="buttonProps"
                @click="handleRecommend"
            >
                <FontAwesomeIcon :icon="faHandPeace" />
                recommend
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { BookshelfBook } from "@/types";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/stores/user";
import { useUserShelves } from "@/composables/useUserShelves";
import { convertToPercentage, recommendBook } from "@/utils";
import { getBookProgress } from "@/utils/shelfProgressUtils";
import BookCover from "@/components/features/common/BookCover.vue";
import BookMetadata from "@/components/features/common/BookMetadata.vue";
import BookshelfBookListItemActions from "@/components/features/UserProfile/Shelves/BookshelfListItemActions.vue";
import BlurbAndDescription from "@/components/features/common/BlurbAndDescription.vue";
import ProgressSliderInput from "@/components/form/ProgressSliderInput.vue";
import ElementSwap from "@/components/transitions/ElementSwap.vue";
import { faHandPeace, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import TagsContainer from "../../common/TagsContainer.vue";

const props = defineProps<{
    book: BookshelfBook;
    isLoggedInUser: boolean;
}>();

const { mobile } = useDisplay();
const { loggedInUser } = useUserStore();
const { updateShelfBookProgress, finishCurrentlyReading } = useUserShelves();

const updateModeEnabled = ref(false);
const currentProgress = computed(() =>
    getBookProgress(loggedInUser, props.book.id)
);
const updatedProgress = ref(currentProgress.value);
const initialProgress = ref(currentProgress.value);

// Watch for changes in the store and update local refs
watch(currentProgress, (newProgress) => {
    if (!updateModeEnabled.value) {
        updatedProgress.value = newProgress;
        initialProgress.value = newProgress;
    }
});

const showProgressSection = computed(() => {
    return props.isLoggedInUser && props.book.pages && props.book.pages > 0;
});

const updateButtonConfig = computed(() => {
    return {
        label: updateModeEnabled.value ? "confirm" : "update",
        variant: updateModeEnabled.value ? "outline-success" : "outline",
    };
});

const buttonProps = computed(() => {
    return {
        size: mobile.value ? "xsmall" : "small",
        style: { width: "100%" },
    };
});

const userPercentage = computed(() => {
    return convertToPercentage(updatedProgress.value, props.book.pages || 1);
});

const inputStyle = computed(() => {
    return {
        textAlign: "right",
        minWidth: "55px",
        maxWidth: "80px",
    };
});

const handleProgressChange = (value: number) => {
    if (value >= initialProgress.value) {
        updatedProgress.value = Math.round(value);
    }
};

const setUpdateModeEnabled = (value: boolean) => {
    updateModeEnabled.value = value;
};

const onUpdateClick = async () => {
    if (!updateModeEnabled.value) {
        setUpdateModeEnabled(true);
    } else {
        await updateShelfBookProgress(props.book.id, updatedProgress.value);
        setUpdateModeEnabled(false);
    }
};

const onCancelClick = () => {
    setUpdateModeEnabled(false);
    updatedProgress.value = currentProgress.value;
};

const handleFinished = async () => {
    await finishCurrentlyReading(props.book.id);
};

const handleRecommend = () => recommendBook(props.book);
</script>

<style scoped>
.currently-reading-book-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 1px solid var(--accent-blue);
    border-radius: 1rem;
    padding: 1rem;
    background-color: var(--surface-color);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.book-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.cover-and-info {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
}

.info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
}

.title-container {
    display: flex;
    gap: 0.25rem;
    justify-content: space-between;
    width: 100%;
}

.title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    font-style: italic;
    line-height: 1.3;
}

/* Progress Section */
.progress-section {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--accent-blue);
}

.user-progress {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
}

.progress-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    width: 100%;
    min-height: 28px;
    font-weight: 600;
}

.progress-percentage {
    font-size: 0.875rem;
    font-weight: 400;
    color: var(--accent-fuschia);
}

.progress-page-info {
    color: var(--accent-blue);
}

.progress-actions {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-evenly;
    gap: 0.65rem;
}

/* Action Buttons */
.actions {
    padding: 0.5rem 0;
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
    align-items: center;
}

@media (min-width: 768px) {
    .cover-and-info {
        gap: 1rem;
    }

    .title {
        font-size: 1.375rem;
    }

    .tags {
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .progress-info {
        font-size: 1.125rem;
    }

    .progress-percentage {
        font-size: 1.125rem;
    }
}
</style>
