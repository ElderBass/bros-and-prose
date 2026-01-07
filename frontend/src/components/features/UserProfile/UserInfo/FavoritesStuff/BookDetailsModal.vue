<template>
    <BaseModal
        :modelValue="open"
        @close="closeModal"
        title="a favorite of yours"
        size="medium"
        shadow-color="fuschia"
        :header-icon="faHeart"
    >
        <div v-if="book" class="content">
            <div class="top">
                <BookCover :book="book" />

                <div class="headline">
                    <div class="title-row">
                        <h2 class="title">{{ book.title }}</h2>
                    </div>
                    <p class="author">{{ book.author }}</p>

                    <div class="meta">
                        <span class="meta-item">
                            <span class="meta-label">year</span>
                            <span class="meta-value">{{
                                book.yearPublished || "—"
                            }}</span>
                        </span>
                        <span class="meta-sep">|</span>
                        <span class="meta-item">
                            <span class="meta-label">pages</span>
                            <span class="meta-value">{{
                                book.pages || "—"
                            }}</span>
                        </span>
                    </div>

                    <TagsSection :book="book" />
                </div>
            </div>

            <BlurbSection :book="book" :canReview="canReview" />
        </div>
        <div v-else class="content">
            <p class="empty italics">no book selected.</p>
        </div>

        <template #footer>
            <BaseButton
                variant="outline"
                color="fuschia"
                size="medium"
                @click="closeModal"
            >
                close
            </BaseButton>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { BookshelfBook } from "@/types";
import BookCover from "@/components/features/UserProfile/Shelves/HaveReadSection/BookDetailsComponents/BookCover.vue";
import BlurbSection from "@/components/features/UserProfile/Shelves/HaveReadSection/BookDetailsComponents/BlurbSection.vue";
import TagsSection from "@/components/features/UserProfile/Shelves/HaveReadSection/BookDetailsComponents/TagsSection.vue";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

defineOptions({
    name: "BookDetailsModal",
});

defineProps<{
    open: boolean;
    book: BookshelfBook | null;
}>();

const emit = defineEmits<{
    (e: "close"): void;
}>();

const router = useRouter();

const closeModal = () => {
    emit("close");
};

const canReview = computed(() => {
    return router.currentRoute.value.name === "profile-root";
});
</script>

<style scoped>
.content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding-top: 0.5rem;
}

.top {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
}

.headline {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
}

.title {
    margin: 0;
    font-size: 1.6rem;
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    font-style: italic;
    line-height: 1.15;
}

.author {
    margin: 0;
    color: var(--accent-green);
    font-size: 1rem;
    opacity: 0.95;
}

.meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    font-size: 0.95rem;
    color: var(--main-text);
    opacity: 0.9;
    flex-wrap: wrap;
}

.meta-item {
    display: inline-flex;
    gap: 0.35rem;
    align-items: baseline;
}

.meta-label {
    color: var(--accent-fuschia);
    font-weight: 600;
    opacity: 0.9;
}

.meta-sep {
    opacity: 0.5;
    color: var(--accent-fuschia);
}

.empty {
    margin: 0;
    opacity: 0.75;
    color: var(--main-text);
}

.italics {
    font-style: italic;
}

@media (max-width: 768px) {
    .top {
        gap: 0.75rem;
    }
    .title {
        font-size: 1.35rem;
    }
}
</style>
