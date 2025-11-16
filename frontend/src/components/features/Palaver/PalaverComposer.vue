<template>
    <div class="composer">
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
            :recTitle="recTitle"
            :recAuthor="recAuthor"
            :tags="tags"
            :onTagClick="onTagClick"
        />

        <BaseTextArea
            v-model="text"
            id="palaver-item-text-input"
            :label="messages.placeholder"
            :placeholder="messages.placeholder"
        />

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
import { v4 as uuidv4 } from "uuid";
import ItemTypeButton from "./ItemTypeButton.vue";
import BookSelect from "@/components/form/BookSelect.vue";
import BookRecommendationFormFields from "./BookRecommendationFormFields.vue";
import { useUserStore } from "@/stores/user";
import { usePalaver } from "@/composables";
import type { ItemTypeButtonProp, PalaverEntry, PalaverType } from "@/types";
import { getUserInfo } from "@/utils";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

defineProps<{
    closeModal: () => void;
}>();

const type = ref<PalaverType>("discussion_note");
const text = ref("");
const bookId = ref("");
const recTitle = ref("");
const recAuthor = ref("");
const tags = ref<string[]>([]);

const userStore = useUserStore();
const { createPalaverEntry } = usePalaver();

const itemTypeButtons: ItemTypeButtonProp[] = [
    {
        type: "discussion_note",
        label: "book comment",
    },
    {
        type: "recommendation",
        label: "book rec",
    },
    {
        type: "misc",
        label: "misc shit",
    },
];

const onTagClick = (tag: string) => {
    if (tags.value.includes(tag)) {
        tags.value = tags.value.filter((t) => t !== tag);
    } else {
        tags.value.push(tag);
    }
};
const submitDisabled = computed(() => {
    if (text.value.trim().length < 3) return true;
    if (
        type.value === "recommendation" &&
        (!recTitle.value.trim() || !recAuthor.value.trim())
    )
        return true;
    return false;
});

const submit = async () => {
    const entry: PalaverEntry = {
        id: uuidv4(),
        type: type.value,
        text: text.value.trim(),
        createdAt: new Date().toISOString(),
        userInfo: getUserInfo(userStore.loggedInUser),
        recommendation:
            type.value === "recommendation"
                ? {
                      title: recTitle.value.trim(),
                      author: recAuthor.value.trim(),
                  }
                : undefined,
    };
    await createPalaverEntry(entry);
    text.value = "";
    recTitle.value = "";
    recAuthor.value = "";
};

const messages = computed(() => {
    switch (type.value) {
        case "discussion_note":
            return {
                stock: "just keep it PG, fuckboy",
                placeholder: "dish out the tea, my dude",
            };
        case "recommendation":
            return {
                stock: "recommend a book ferda boys",
                placeholder: "paint the boys a lascivious picture...",
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
</script>

<style scoped>
.composer {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
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
