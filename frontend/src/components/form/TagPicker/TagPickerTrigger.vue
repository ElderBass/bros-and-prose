<template>
    <div class="tag-picker-trigger">
        <div class="top-row">
            <label class="label">{{ label }}</label>
            <BaseButton
                :variant="isEdit ? 'outline-secondary' : 'outline-success'"
                :size="mobile ? 'xsmall' : 'small'"
                title="browse all tags"
                @click="open = true"
            >
                {{ isEdit ? "edit tags" : "add tags" }}
            </BaseButton>
        </div>

        <div v-if="modelValue.length" class="chips">
            <button
                v-for="tag in modelValue"
                :key="tag"
                type="button"
                class="chip"
                :title="`remove ${tag}`"
                @click="remove(tag)"
            >
                <span class="chip-text">{{ tag }}</span>
                <span class="chip-x">×</span>
            </button>
        </div>
        <div v-else class="no-tags-container">
            <NoTags :size="mobile ? 'small' : 'medium'" />
        </div>

        <TagPickerDrawer
            v-if="variant === 'drawer'"
            :open="open"
            :modelValue="modelValue"
            :allTags="allTagsResolved"
            @close="open = false"
            @update:modelValue="commit"
        />
        <TagPickerModal
            v-else
            :open="open"
            :modelValue="modelValue"
            :allTags="allTagsResolved"
            @close="open = false"
            @update:modelValue="commit"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import { COMMON_BOOK_TAGS } from "@/constants";
import TagPickerDrawer from "./TagPickerDrawer.vue";
import TagPickerModal from "./TagPickerModal.vue";
import NoTags from "@/components/features/common/NoTags.vue";

const props = withDefaults(
    defineProps<{
        modelValue: string[];
        label?: string;
        allTags?: string[];
        variant?: "drawer" | "modal";
        isEdit?: boolean;
    }>(),
    {
        label: "tags",
        allTags: undefined,
        variant: "drawer",
        isEdit: false,
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string[]): void;
}>();

const { mobile } = useDisplay();

const open = ref(false);

const normalize = (t: string) => t.trim().toLowerCase();

const allTagsResolved = computed(() => props.allTags ?? COMMON_BOOK_TAGS);

const remove = (tag: string) => {
    const next = props.modelValue.filter(
        (t) => normalize(t) !== normalize(tag)
    );
    emit("update:modelValue", next);
};

const commit = (next: string[]) => {
    emit("update:modelValue", next);
    open.value = false;
};
</script>

<style scoped>
.tag-picker-trigger {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.label {
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--accent-blue);
}

.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.6rem;
    border-radius: 9999px;
    border: 1px solid var(--accent-fuschia);
    background: color-mix(in srgb, var(--accent-fuschia) 12%, transparent);
    color: var(--accent-fuschia);
    cursor: pointer;
    transition:
        transform 0.12s ease,
        background-color 0.12s ease;
}

.chip:hover {
    transform: translateY(-1px);
    background: color-mix(in srgb, var(--accent-fuschia) 20%, transparent);
}

.chip-text {
    font-size: 0.9rem;
    font-style: italic;
}

.chip-x {
    font-size: 1.05rem;
    line-height: 1;
    opacity: 0.9;
}

.no-tags-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.italics {
    font-style: italic;
}

@media (max-width: 768px) {
    .label {
        font-size: 1.05rem;
    }
}
</style>
