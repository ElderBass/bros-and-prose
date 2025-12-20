<template>
    <div class="tag-picker-panel">
        <div class="header">
            <p class="subtitle">peruse, muse, choose</p>
            <div class="selected-count">{{ draftTags.length }} selected</div>
        </div>

        <div class="search-row">
            <input
                class="search-input"
                :value="query"
                @input="query = ($event.target as HTMLInputElement).value ?? ''"
                :placeholder="searchPlaceholder"
                aria-label="search tags"
            />
            <ClearSearchButton
                v-if="query.trim().length"
                :onClick="() => (query = '')"
                :size="mobile ? 'small' : 'medium'"
            />
            <FontAwesomeIcon v-else :icon="faSearch" class="search-icon" />
        </div>

        <div v-if="draftTags.length" class="chips">
            <button
                v-for="tag in draftTags"
                :key="tag"
                type="button"
                class="chip"
                :title="`remove ${tag}`"
                @click="toggle(tag)"
            >
                <span class="chip-text">{{ tag }}</span>
                <span class="chip-x">×</span>
            </button>
            <BaseButton
                variant="outline-error"
                size="xsmall"
                title="clear selected tags"
                @click="clearDraft"
            >
                clear
            </BaseButton>
        </div>

        <div class="list" role="list">
            <div
                v-for="section in grouped"
                :key="section.letter"
                class="section"
            >
                <div class="section-letter">{{ section.letter }}</div>
                <div class="tag-grid">
                    <BookTag
                        v-for="tag in section.tags"
                        :key="tag"
                        :tag="tag"
                        :selected="draftTags.includes(tag)"
                        color="blue"
                        :size="mobile ? 'xsmall' : 'small'"
                        :onClick="() => toggle(tag)"
                    />
                </div>
            </div>

            <div v-if="grouped.length === 0" class="no-results">
                no matches — try another word
            </div>
        </div>

        <div class="footer">
            <BaseButton
                variant="outline-secondary"
                :size="footerButtonSize"
                title="cancel and discard changes"
                @click="emit('cancel')"
            >
                cancel
            </BaseButton>
            <BaseButton
                variant="outline-error"
                :size="footerButtonSize"
                title="clear selected tags"
                @click="clearDraft"
            >
                clear
            </BaseButton>
            <BaseButton
                variant="success"
                :size="footerButtonSize"
                title="confirm tags"
                @click="emit('done', draftTags)"
            >
                done
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import BookTag from "@/components/ui/BookTag.vue";
import ClearSearchButton from "@/components/features/UserProfile/Shelves/ShelfModals/FormStuff/ClearSearchButton.vue";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

defineOptions({ name: "TagPickerPanel" });

const props = withDefaults(
    defineProps<{
        allTags: string[];
        initialTags: string[];
        title?: string;
        searchPlaceholder?: string;
    }>(),
    {
        title: "add tags",
        searchPlaceholder: "search tags…",
    }
);

const emit = defineEmits<{
    (e: "cancel"): void;
    (e: "done", tags: string[]): void;
}>();

const { mobile } = useDisplay();

const query = ref("");
const draftTags = ref<string[]>([]);

const normalize = (t: string) => t.trim().toLowerCase();

watch(
    () => props.initialTags,
    (next) => {
        draftTags.value = [...(next || [])];
        query.value = "";
    },
    { immediate: true, deep: true }
);

const filteredAllTags = computed(() => {
    const q = normalize(query.value);
    const unique = Array.from(
        new Set((props.allTags || []).map((t) => t.trim()).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

    if (!q) return unique;
    return unique.filter((t) => normalize(t).includes(q));
});

const grouped = computed(() => {
    const map = new Map<string, string[]>();
    for (const tag of filteredAllTags.value) {
        const letter = (tag[0] || "#").toUpperCase();
        if (!map.has(letter)) map.set(letter, []);
        map.get(letter)!.push(tag);
    }
    return Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([letter, tags]) => ({ letter, tags }));
});

const footerButtonSize = computed(() => {
    return mobile.value ? "small" : "medium";
});

const toggle = (tag: string) => {
    const next = tag.trim();
    if (!next) return;
    const idx = draftTags.value.findIndex(
        (t) => normalize(t) === normalize(next)
    );
    if (idx >= 0) {
        draftTags.value = draftTags.value.filter(
            (t) => normalize(t) !== normalize(next)
        );
        return;
    }
    draftTags.value = [...draftTags.value, next];
};

const clearDraft = () => {
    draftTags.value = [];
};
</script>

<style scoped>
.tag-picker-panel {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
}

.title {
    margin: 0;
    font-family: "Libre Baskerville", serif;
    font-size: 1.25rem;
    color: var(--accent-fuschia);
}

.subtitle {
    font-size: 1.125rem;
    margin: 0.25rem 0 0;
    color: var(--main-text);
    font-style: italic;
    opacity: 0.85;
}

.selected-count {
    white-space: nowrap;
    color: var(--accent-fuschia);
    opacity: 0.9;
    font-style: italic;
    padding-top: 0.15rem;
}

.search-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.search-input {
    width: 100%;
    background-color: transparent;
    color: var(--main-text);
    border: none;
    border-bottom: 2px solid
        color-mix(in srgb, var(--accent-blue) 55%, transparent);
    border-radius: 0;
    padding: 0.45rem 0.1rem;
    font-family: "Crimson Text", serif;
    font-size: 1.05rem;
    outline: none;
    transition: border-color 0.2s ease;
}

.search-input::placeholder {
    color: var(--main-text);
    opacity: 0.55;
    font-style: italic;
}

.search-input:focus {
    border-bottom-color: var(--accent-fuschia);
}

.search-icon {
    font-size: 1rem;
    color: var(--accent-blue);
    opacity: 0.75;
}

.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
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

.list {
    width: 100%;
    max-height: 500px;
    overflow: auto;
    border: 1px solid color-mix(in srgb, var(--accent-blue) 35%, transparent);
    border-radius: 0.75rem;
    padding: 0.5rem;
    background: color-mix(in srgb, var(--accent-lavender) 6%, transparent);
}

.section {
    padding: 0.25rem;
}

.section-letter {
    display: inline-flex;
    padding: 0.1rem 0.35rem;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--accent-fuschia) 60%, transparent);
    background: var(--background-color);
    color: var(--accent-fuschia);
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-align: center;
}

.tag-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
}

.no-results {
    padding: 1rem;
    text-align: center;
    color: var(--main-text);
    opacity: 0.75;
    font-style: italic;
}

.footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
}

@media (max-width: 768px) {
    .list {
        max-height: 400px;
    }
    .title {
        font-size: 1.15rem;
    }
    .search-input {
        font-size: 1rem;
    }
}
</style>
