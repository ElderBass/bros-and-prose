<template>
    <div class="details">
        <div class="form-row">
            <div class="form-container">
                <label :for="authorId" class="label">
                    author<span class="req">*</span>
                </label>
                <BaseInput
                    v-model="authorProxy"
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
                        v-model="yearProxy"
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
                        v-model="pagesProxy"
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
                v-model="tagsProxy"
                :label="tagsLabelResolved"
                variant="drawer"
                :isEdit="isEdit"
            />
            <p v-if="requireTags && !tagsProxy.length" class="hint italics">
                tags required
            </p>
        </div>

        <div class="form-container">
            <label :for="descriptionId" class="label">
                blurb
                <span v-if="requireDescription" class="req">*</span>
                <span v-else class="opt">(optional)</span>
            </label>
            <BaseTextArea
                v-model="descriptionProxy"
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
import type { BookFormMode } from "./types";

const props = withDefaults(
    defineProps<{
        mode: BookFormMode;
        author: string;
        yearPublished: string;
        pages?: number;
        tags: string[];
        description: string;
        tagsLabel?: string;
        idPrefix?: string;
    }>(),
    {
        requireTags: false,
        requireDescription: false,
        tagsLabel: undefined,
        idPrefix: "book-form",
    }
);

const emit = defineEmits<{
    (e: "update:author", value: string): void;
    (e: "update:yearPublished", value: string): void;
    (e: "update:pages", value: number | undefined): void;
    (e: "update:tags", value: string[]): void;
    (e: "update:description", value: string): void;
}>();

const isEdit = computed(
    () => props.mode === "edit" || props.mode === "future-edit"
);

const authorId = computed(() => `${props.idPrefix}-author`);
const yearId = computed(() => `${props.idPrefix}-year`);
const pagesId = computed(() => `${props.idPrefix}-pages`);
const descriptionId = computed(() => `${props.idPrefix}-description`);

const requireTags = computed(() => {
    return props.mode === "future" || props.mode === "future-edit";
});
const requireDescription = computed(() => {
    return props.mode === "future" || props.mode === "future-edit";
});
const tagsLabelResolved = computed(() => {
    if (props.tagsLabel) return props.tagsLabel;
    return requireTags.value ? "tags (required)" : "tags (optional)";
});

const authorProxy = computed({
    get: () => props.author,
    set: (v: string) => emit("update:author", v),
});
const yearProxy = computed({
    get: () => props.yearPublished,
    set: (v: string) => emit("update:yearPublished", v),
});
const pagesProxy = computed({
    get: () => props.pages,
    set: (v: string | number | undefined) => {
        const parsed = typeof v === "string" ? parseInt(v) : v;
        emit("update:pages", Number.isFinite(parsed) ? parsed : undefined);
    },
});
const tagsProxy = computed({
    get: () => props.tags,
    set: (v: string[]) => emit("update:tags", v),
});
const descriptionProxy = computed({
    get: () => props.description,
    set: (v: string) => emit("update:description", v),
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

.hint {
    margin: 0;
    padding-left: 0.5rem;
    opacity: 0.8;
    font-size: 0.9rem;
}

.italics {
    font-style: italic;
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
