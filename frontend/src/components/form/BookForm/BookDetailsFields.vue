<template>
    <div class="details">
        <div class="form-row">
            <div class="form-container">
                <label :for="authorId" class="label">
                    author<span class="req">*</span>
                </label>
                <BaseInput
                    v-model="bookProxy.author"
                    :id="authorId"
                    label="author"
                    size="medium"
                    placeholder="author"
                    :disabled="isEdit"
                />
            </div>

            <div class="year-and-pages-row">
                <div class="form-container">
                    <label :for="yearId" class="label">
                        year published<span class="req">*</span>
                    </label>
                    <BaseInput
                        v-model="bookProxy.yearPublished"
                        :id="yearId"
                        label="year published"
                        placeholder="year"
                        size="medium"
                        :disabled="isEdit"
                    />
                </div>

                <div class="form-container">
                    <label :for="pagesId" class="label">pages</label>
                    <BaseInput
                        v-model="bookProxy.pages"
                        type="number"
                        :id="pagesId"
                        label="pages"
                        placeholder="pages"
                        size="medium"
                        :disabled="isEdit"
                    />
                </div>
            </div>
        </div>

        <div class="form-container">
            <TagPickerTrigger
                v-model="bookProxy.tags"
                :label="tagsLabelResolved"
                variant="drawer"
                :isEdit="isEdit"
            />
        </div>

        <ReviewFormInputs
            v-if="showReviewForm(mode)"
            :rating="review.rating"
            :comment="review.reviewComment"
            @update="emit('update:review', $event)"
        />

        <div v-else class="form-container">
            <label :for="descriptionId" class="label">
                blurb
                <span v-if="requireExtras" class="req">*</span>
                <span v-else class="opt">(optional)</span>
            </label>
            <BaseTextArea
                v-model="bookProxy.description"
                :id="descriptionId"
                label="blurb"
                placeholder="give this guy a little blurb for your bros"
                :style="{ height: '160px' }"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TagPickerTrigger from "@/components/form/TagPicker/TagPickerTrigger.vue";
import ReviewFormInputs from "@/components/form/ReviewFormInputs.vue";
import type { BookFormMode, BookFormValues } from "./types";
import { showReviewForm } from "./utils";
import type { BookshelfBook, FutureBook, SubmitReviewArgs } from "@/types";
import { DEFAULT_REVIEW } from "@/constants";

const props = withDefaults(
    defineProps<{
        mode: BookFormMode;
        book: BookshelfBook | FutureBook;
        idPrefix?: string;
        review?: SubmitReviewArgs;
    }>(),
    {
        idPrefix: "book-form",
        review: () => DEFAULT_REVIEW,
    }
);

const emit = defineEmits<{
    (e: "update:book", value: BookFormValues): void;
    (e: "update:review", value: SubmitReviewArgs): void;
}>();

const isEdit = computed(
    () => props.mode === "edit" || props.mode === "future-edit"
);

const authorId = computed(() => `${props.idPrefix}-author`);
const yearId = computed(() => `${props.idPrefix}-year`);
const pagesId = computed(() => `${props.idPrefix}-pages`);
const descriptionId = computed(() => `${props.idPrefix}-description`);

const requireExtras = computed(() => {
    return props.mode === "future" || props.mode === "future-edit";
});
const tagsLabelResolved = computed(() => {
    return requireExtras.value ? "tags (required)" : "tags (optional)";
});

const bookProxy = computed({
    get: () => props.book,
    set: (v: BookFormValues) => emit("update:book", v),
});
</script>

<style scoped>
.details {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-row {
    display: flex;
    gap: 1rem;
    width: 100%;
}

.year-and-pages-row {
    display: flex;
    gap: 1rem;
    width: 100%;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
}

.label {
    font-size: 1.25rem;
    font-weight: 400;
    color: var(--accent-blue);
    padding-left: 0.5rem;
}

.req {
    margin-left: 0.25rem;
    color: var(--accent-fuschia);
}

@media (max-width: 768px) {
    .form-row {
        flex-direction: column;
        gap: 0.5rem;
    }
    .label {
        font-size: 1.1rem;
    }
}
</style>
