<template>
    <div class="composer">
        <div class="content">
            <div class="type-selector">
                <ItemTypeButton
                    v-for="buttonConfig in itemTypeButtons"
                    :key="buttonConfig.type"
                    :config="buttonConfig"
                    :selected="type === buttonConfig.type"
                    :disabled="isEditMode"
                    @click="handleTypeSelect(buttonConfig.type)"
                />
            </div>

            <p class="stock-text">{{ messages.stock }}</p>

            <BookSelect
                v-if="shouldShowBookSelect"
                v-model="bookInfo"
                :disabled="isEditMode"
            />
            <BookRecommendationFormFields
                v-if="type === 'recommendation'"
                :tags="tags"
                :onTagClick="onTagClick"
                @update:recTitle="recTitle = $event"
                @update:recAuthor="recAuthor = $event"
            />

            <BaseTextArea
                v-model="text"
                id="palaver-item-text-input"
                :label="messages.placeholder"
                :placeholder="messages.placeholder"
            />
        </div>
        <div class="actions">
            <BaseButton
                variant="outline"
                :size="mobile ? 'small' : 'medium'"
                @click="closeModal"
                :style="{ width: mobile ? '100%' : 'auto' }"
                >cancel</BaseButton
            >
            <BaseButton
                :disabled="submitDisabled"
                variant="success"
                :size="mobile ? 'small' : 'medium'"
                :style="{ width: mobile ? '100%' : 'auto' }"
                @click="submit"
            >
                {{ isEditMode ? "update" : "send it" }}
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useDisplay } from "vuetify";
import ItemTypeButton from "./ItemTypeButton.vue";
import BookSelect from "@/components/form/BookSelect.vue";
import BookRecommendationFormFields from "./BookRecommendationFormFields.vue";
import { usePalaver } from "@/composables";
import type { ItemTypeButtonProp, PalaverType, PalaverEntry } from "@/types";
import { buildPalaverEntry } from "@/utils";
import { useLog } from "@/composables";
import { usePalaverStore } from "@/stores/palaver";
import { useUserStore } from "@/stores/user";
import { EMPTY_BOOK_INFO } from "@/constants";

const props = defineProps<{
    entry: PalaverEntry;
    setLoading: (loading: boolean) => void;
}>();

const itemTypeButtons: ItemTypeButtonProp[] = [
    {
        type: "discussion_note",
        label: "comment",
        title: "comment on a book",
    },
    {
        type: "recommendation",
        label: "recommend",
        title: "recommend a book",
    },
    {
        type: "suggestion",
        label: "suggest",
        title: "suggest an idea for the app",
    },
    {
        type: "misc",
        label: "misc",
        title: "speak into the void",
    },
];

const { mobile } = useDisplay();
const { createPalaverEntry, updatePalaverEntry } = usePalaver();
const { closeModal, openErrorModal, openSuccessModal } = usePalaverStore();

const type = ref<PalaverType>("discussion_note");
const text = ref("");
const bookInfo = ref(EMPTY_BOOK_INFO);
const recTitle = ref("");
const recAuthor = ref("");
const tags = ref<string[]>([]);

const isEditMode = computed(() => Boolean(props.entry?.id));
const shouldShowBookSelect = computed(() =>
    ["discussion_note", "progress_note"].includes(type.value)
);

const resetForm = () => {
    type.value = "discussion_note";
    text.value = "";
    bookInfo.value = EMPTY_BOOK_INFO;
    recTitle.value = "";
    recAuthor.value = "";
    tags.value = [];
};

const syncFormWithEntry = (entry: PalaverEntry) => {
    if (!entry?.id) {
        resetForm();
        return;
    }

    type.value = entry.type;
    text.value = entry.text ?? "";
    bookInfo.value = entry.bookInfo ? { ...entry.bookInfo } : EMPTY_BOOK_INFO;
    recTitle.value = entry.recommendation?.title ?? "";
    recAuthor.value = entry.recommendation?.author ?? "";
    tags.value = entry.recommendation?.tags
        ? [...entry.recommendation.tags]
        : [];
};

watch(
    () => props.entry,
    (entry) => {
        if (entry?.id) {
            syncFormWithEntry(entry);
        } else {
            resetForm();
        }
    },
    { immediate: true }
);

const messages = computed(() => {
    switch (type.value) {
        case "discussion_note":
            return {
                stock: "comment on a book",
                placeholder: "dish out the tea, my dude",
            };
        case "progress_note":
            return {
                stock: "log your progress",
                placeholder: "what page you at, chief?",
            };
        case "recommendation":
            return {
                stock: "get the boys (e)rect",
                placeholder: "paint'em a lascivious picture...",
            };
        case "suggestion":
            return {
                stock: "suggest an idea for the app",
                placeholder:
                    "don't hold back; that pussy ElderBass can handle it",
            };
        case "misc":
            return {
                stock: "speak into the void",
                placeholder: "get it off your burly chest, my dude",
            };
        default:
            return {
                stock: "spit your take, bro...",
                placeholder:
                    "really, spit it out, I want that shit wet baby boy...",
            };
    }
});

const submitDisabled = computed(() => {
    if (text.value.trim().length < 3) return true;
    if (
        type.value === "recommendation" &&
        (!recTitle.value.trim() ||
            !recAuthor.value.trim() ||
            !tags.value.length ||
            tags.value.length === 0)
    ) {
        return true;
    }
    return false;
});

const onTagClick = (tag: string) => {
    if (tags.value.includes(tag)) {
        tags.value = tags.value.filter((t) => t !== tag);
    } else {
        tags.value.push(tag);
    }
};

const handleTypeSelect = (selectedType: PalaverType) => {
    if (isEditMode.value) return;
    type.value = selectedType;
};

const buildEntryPayload = () =>
    buildPalaverEntry({
        type: type.value,
        text: text.value.trim(),
        bookInfo: bookInfo.value,
        recTitle: recTitle.value.trim(),
        recAuthor: recAuthor.value.trim(),
        tags: tags.value,
    });

const submit = async () => {
    try {
        props.setLoading(true);
        const normalizedEntry = buildEntryPayload();

        if (isEditMode.value) {
            const updatedEntry: PalaverEntry = {
                ...props.entry,
                type: normalizedEntry.type,
                text: normalizedEntry.text,
                bookInfo: normalizedEntry.bookInfo,
                recommendation: normalizedEntry.recommendation,
            };
            await updatePalaverEntry(updatedEntry, {
                username: useUserStore().loggedInUser?.username,
                updateType: type.value,
            });
            openSuccessModal(type.value, "update");
        } else {
            await createPalaverEntry(normalizedEntry);
            openSuccessModal(type.value, "create");
            resetForm();
        }
    } catch (error) {
        console.error("Error submitting palaver entry:", error);
        await useLog().error(`Error submitting palaver entry: ${error}`);
        openErrorModal(
            (error as Error).message,
            isEditMode.value ? "update" : "create"
        );
    } finally {
        props.setLoading(false);
    }
};
</script>

<style scoped>
.composer {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 0.75rem;
    gap: 1rem;
}
.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.type-selector {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
}
.stock-text {
    text-align: center;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--accent-blue);
}
.actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

@media (max-width: 768px) {
    .composer {
        padding-top: 0.5rem;
    }
    .content {
        gap: 0.75rem;
    }
    .actions {
        width: 100%;
        gap: 0.5rem;
        justify-content: center;
    }
}
</style>
