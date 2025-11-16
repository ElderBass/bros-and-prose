<template>
    <div class="composer">
        <div class="content">
            <div class="type-selector">
                <ItemTypeButton
                    v-for="buttonConfig in itemTypeButtons"
                    :key="buttonConfig.type"
                    :config="buttonConfig"
                    :selected="type === buttonConfig.type"
                    @click="type = buttonConfig.type"
                />
            </div>

            <p class="stock-text">{{ messages.stock }}</p>

            <BookSelect v-if="type === 'discussion_note'" v-model="bookId" />
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
                send it
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import ItemTypeButton from "./ItemTypeButton.vue";
import BookSelect from "@/components/form/BookSelect.vue";
import BookRecommendationFormFields from "./BookRecommendationFormFields.vue";
import { usePalaver } from "@/composables";
import type { ItemTypeButtonProp, PalaverType } from "@/types";
import { buildPalaverEntry } from "@/utils";
import { useLog } from "@/composables";
import { usePalaverStore } from "@/stores/palaver";

const props = defineProps<{
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
const { createPalaverEntry } = usePalaver();
const { closeModal, openErrorModal, openSuccessModal } = usePalaverStore();

const type = ref<PalaverType>("discussion_note");
const text = ref("");
const bookId = ref("");
const recTitle = ref("");
const recAuthor = ref("");
const tags = ref<string[]>([]);

const messages = computed(() => {
    switch (type.value) {
        case "discussion_note":
            return {
                stock: "comment on a book",
                placeholder: "dish out the tea, my dude",
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
            !tags.value.length)
    )
        return true;

    return false;
});

const onTagClick = (tag: string) => {
    if (tags.value.includes(tag)) {
        tags.value = tags.value.filter((t) => t !== tag);
    } else {
        tags.value.push(tag);
    }
};

const submit = async () => {
    try {
        props.setLoading(true);
        const entry = buildPalaverEntry({
            type: type.value,
            text: text.value.trim(),
            bookId: bookId.value,
            recTitle: recTitle.value.trim(),
            recAuthor: recAuthor.value.trim(),
            tags: tags.value,
        });
        await createPalaverEntry(entry);
        openSuccessModal(type.value, "create");
        text.value = "";
        recTitle.value = "";
        recAuthor.value = "";
        tags.value = [];
        bookId.value = "";
    } catch (error) {
        console.error("Error submitting palaver entry:", error);
        await useLog().error(`Error submitting palaver entry: ${error}`);
        openErrorModal((error as Error).message, "create");
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
    .actions {
        width: 100%;
        gap: 0.5rem;
        justify-content: center;
    }
}
</style>
