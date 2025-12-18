<template>
    <div class="inline-tag-picker">
        <div class="input-row">
            <label class="label" :for="inputId">{{ label }}</label>

            <div class="input-wrap">
                <input
                    :id="inputId"
                    v-model="query"
                    class="tag-input"
                    type="text"
                    :placeholder="placeholder"
                    autocomplete="off"
                    @keydown.enter.prevent="commitFirstSuggestion"
                    @keydown.down.prevent="highlightNext"
                    @keydown.up.prevent="highlightPrev"
                    @keydown.esc.prevent="closeSuggestions"
                    @focus="isFocused = true"
                    @blur="handleBlur"
                />

                <div v-if="showSuggestions" class="suggestions">
                    <button
                        v-for="(tag, idx) in filteredSuggestions"
                        :key="tag"
                        type="button"
                        class="suggestion"
                        :class="{ active: idx === highlightedIndex }"
                        @mousedown.prevent="addTag(tag)"
                    >
                        {{ tag }}
                    </button>
                    <div
                        v-if="filteredSuggestions.length === 0"
                        class="no-match"
                    >
                        no matches — hit enter to add “{{ query.trim() }}”
                    </div>
                </div>
            </div>
        </div>

        <div v-if="modelValue.length" class="chips">
            <button
                v-for="tag in modelValue"
                :key="tag"
                type="button"
                class="chip"
                @click="removeTag(tag)"
                :title="`remove ${tag}`"
            >
                <span class="chip-text">{{ tag }}</span>
                <span class="chip-x">×</span>
            </button>
        </div>

        <div class="popular">
            <p class="popular-title">popular:</p>
            <div class="popular-row">
                <BookTag
                    v-for="tag in popularTagsResolved"
                    :key="tag"
                    :tag="tag"
                    :selected="modelValue.includes(tag)"
                    color="blue"
                    :size="mobile ? 'xsmall' : 'small'"
                    :onClick="() => toggleTag(tag)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import BookTag from "@/components/ui/BookTag.vue";
import { COMMON_BOOK_TAGS } from "@/constants";

defineOptions({ name: "InlineBookTagsPicker" });

const props = withDefaults(
    defineProps<{
        modelValue: string[];
        label?: string;
        placeholder?: string;
        suggestions?: string[];
        popularTags?: string[];
        maxSuggestions?: number;
    }>(),
    {
        label: "tags (optional)",
        placeholder: "type to add tags…",
        suggestions: () => COMMON_BOOK_TAGS,
        popularTags: undefined,
        maxSuggestions: 6,
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string[]): void;
}>();

const { mobile } = useDisplay();

const inputId = `inline-tags-${Math.random().toString(16).slice(2)}`;

const isFocused = ref(false);
const query = ref("");
const highlightedIndex = ref(0);

const normalize = (t: string) => t.trim().toLowerCase();

const suggestionsSource = computed(() => {
    // Unique + stable-ish
    const base = props.suggestions || [];
    return Array.from(new Set(base.map((t) => t.trim()).filter(Boolean)));
});

const filteredSuggestions = computed(() => {
    const q = normalize(query.value);
    if (!q) return [];

    const selected = new Set(props.modelValue.map(normalize));

    return suggestionsSource.value
        .filter((t) => !selected.has(normalize(t)))
        .filter((t) => normalize(t).includes(q))
        .slice(0, props.maxSuggestions);
});

const showSuggestions = computed(() => {
    return isFocused.value && query.value.trim().length > 0;
});

const popularTagsResolved = computed(() => {
    if (props.popularTags?.length) return props.popularTags;
    // small, curated default set from your existing tag universe
    return [
        "classic",
        "fantasy",
        "sci-fi",
        "thriller",
        "mystery",
        "horror",
        "romance",
        "nonfiction",
        "psychology",
        "literary",
        "humor",
        "dystopian",
    ];
});

const addTag = (tag: string) => {
    const next = normalize(tag);
    if (!next) return;

    const existing = new Set(props.modelValue.map(normalize));
    if (existing.has(next)) return;

    emit("update:modelValue", [...props.modelValue, tag.trim()]);
    query.value = "";
    highlightedIndex.value = 0;
};

const removeTag = (tag: string) => {
    emit(
        "update:modelValue",
        props.modelValue.filter((t) => normalize(t) !== normalize(tag))
    );
};

const toggleTag = (tag: string) => {
    const existing = new Set(props.modelValue.map(normalize));
    if (existing.has(normalize(tag))) removeTag(tag);
    else addTag(tag);
};

const commitFirstSuggestion = () => {
    if (filteredSuggestions.value.length) {
        const idx = Math.min(
            Math.max(highlightedIndex.value, 0),
            filteredSuggestions.value.length - 1
        );
        addTag(filteredSuggestions.value[idx]);
        return;
    }
    // allow freeform
    addTag(query.value);
};

const highlightNext = () => {
    if (!filteredSuggestions.value.length) return;
    highlightedIndex.value =
        (highlightedIndex.value + 1) % filteredSuggestions.value.length;
};

const highlightPrev = () => {
    if (!filteredSuggestions.value.length) return;
    highlightedIndex.value =
        (highlightedIndex.value - 1 + filteredSuggestions.value.length) %
        filteredSuggestions.value.length;
};

const closeSuggestions = () => {
    isFocused.value = false;
};

const handleBlur = () => {
    // Let click on suggestion (mousedown) win.
    window.setTimeout(() => {
        isFocused.value = false;
        highlightedIndex.value = 0;
    }, 0);
};
</script>

<style scoped>
.inline-tag-picker {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.label {
    font-size: 1.25rem;
    font-weight: 400;
    color: var(--accent-blue);
    padding-left: 0.5rem;
}

.input-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-wrap {
    position: relative;
    width: 100%;
}

.tag-input {
    width: 100%;
    background: transparent;
    border: 2px dashed var(--accent-blue);
    border-radius: 0.75rem;
    padding: 0.85rem 1rem;
    color: var(--main-text);
    outline: none;
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
}

.tag-input:focus {
    border-color: var(--accent-fuschia);
    box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--accent-fuschia) 30%, transparent);
}

.suggestions {
    position: absolute;
    top: calc(100% + 0.35rem);
    left: 0;
    right: 0;
    z-index: 20;
    border-radius: 0.75rem;
    border: 2px solid var(--accent-blue);
    background: var(--background-color);
    overflow: hidden;
    box-shadow:
        0 10px 28px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.suggestion {
    width: 100%;
    padding: 0.75rem 1rem;
    text-align: left;
    background: transparent;
    border: none;
    color: var(--accent-blue);
    cursor: pointer;
    transition:
        background-color 0.15s ease,
        color 0.15s ease;
}

.suggestion:hover,
.suggestion.active {
    background-color: var(--accent-lavender);
    color: var(--background-color);
}

.no-match {
    padding: 0.75rem 1rem;
    color: var(--main-text);
    opacity: 0.8;
    font-style: italic;
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

.popular {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.popular-title {
    margin: 0;
    padding-left: 0.5rem;
    color: var(--main-text);
    opacity: 0.75;
    font-style: italic;
}

.popular-row {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
    padding: 0.25rem 0.25rem 0.5rem 0.25rem;
}

/* Make sure tags don't stretch full width in this grid */
.popular-row :deep(.book-tag) {
    display: inline-flex;
    width: fit-content;
    flex: 0 0 auto;
}

@media (max-width: 768px) {
    .label {
        font-size: 1.1rem;
    }

    .tag-input {
        padding: 0.75rem 0.85rem;
    }

    .chip-text {
        font-size: 0.85rem;
    }
}
</style>
