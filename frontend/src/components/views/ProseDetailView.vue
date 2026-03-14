<template>
    <AppLayout>
        <PageTitle title="prose details" />

        <LoadingSpinnerContainer
            v-if="loading"
            size="large"
            message="loading prose details..."
        />
        <div v-else-if="!entry" class="prose-detail-view empty-state">
            <p>couldn't find that prose piece.</p>
        </div>

        <div v-else class="prose-detail-view">
            <BaseCard shadow-color="blue" size="large" class="detail-card">
                <div class="detail-header">
                    <div class="author-meta">
                        <AvatarImage
                            :avatar="entry.userInfo.avatar"
                            :avatarType="entry.userInfo.avatarType || 'icon'"
                            size="small"
                        />
                        <div>
                            <UsernameLink
                                :username="entry.userInfo.username"
                                fontSize="medium"
                            />
                            <p class="date">{{ createdAtLabel }}</p>
                        </div>
                    </div>
                    <span class="type-pill">{{ entry.type }}</span>
                </div>

                <h2 class="title">{{ entry.title }}</h2>
                <div class="markdown-body">
                    <MarkdownContent :markdown="entry.markdown" />
                </div>

                <div class="actions-row">
                    <ProseEntryReactionActions :entry="entry" />
                    <BaseButton
                        v-if="!isGuestUser()"
                        variant="outline-secondary"
                        size="small"
                        title="add a cheeky comment, don't hold back"
                        :showTooltip="false"
                        @click="showCommentModal = true"
                    >
                        cheeky feedback
                    </BaseButton>
                </div>
            </BaseCard>

            <BaseCard
                shadow-color="lavender"
                size="medium"
                class="comments-card"
            >
                <ProseCommentsSection :entry="entry" />
            </BaseCard>
        </div>
    </AppLayout>

    <AddCommentModal
        v-if="showCommentModal"
        :open="showCommentModal"
        :isItemComment="true"
        :submitting="submittingComment"
        @submit="submitComment"
        @close="showCommentModal = false"
    />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import UsernameLink from "@/components/ui/UsernameLink.vue";
import LoadingSpinnerContainer from "@/components/ui/LoadingSpinnerContainer.vue";
import AddCommentModal from "@/components/modal/AddCommentModal.vue";
import ProseEntryReactionActions from "@/components/features/Prose/ProseEntryReactionActions.vue";
import ProseCommentsSection from "@/components/features/Prose/ProseCommentsSection.vue";
import MarkdownContent from "@/components/features/common/MarkdownContent.vue";
import { useProse } from "@/composables/useProse";
import { useProseStore } from "@/stores/prose";
import { useUIStore } from "@/stores/ui";
import { ADDED_COMMENT_SUCCESS_ALERT, QUICK_ERROR } from "@/constants";
import type { Comment, ProseEntry } from "@/types";
import { isGuestUser } from "@/utils";
import { useLog } from "@/composables";

const route = useRoute();
const proseId = computed(() => String(route.params.proseId || ""));

const { entries } = storeToRefs(useProseStore());
const { addComment } = useProse();
const { showAlert } = useUIStore();

const loading = ref(false);
const showCommentModal = ref(false);
const submittingComment = ref(false);
const entry = ref<ProseEntry | undefined>(undefined);

const createdAtLabel = computed(() => {
    if (!entry.value) return "";
    try {
        return new Date(entry.value.createdAt).toLocaleString(undefined, {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return entry.value.createdAt;
    }
});

const submitComment = async (comment: Comment) => {
    if (!entry.value) return;
    submittingComment.value = true;
    try {
        await addComment(entry.value, comment);
        showCommentModal.value = false;
        showAlert(ADDED_COMMENT_SUCCESS_ALERT);
    } catch (error) {
        console.error("Error adding prose comment:", error);
        await useLog().error(`Error adding prose comment: ${error}`);
        showAlert(
            QUICK_ERROR([
                "failed to add feedback",
                (error as Error).message || "unknown error",
            ])
        );
    } finally {
        submittingComment.value = false;
    }
};
onMounted(() => {
    entry.value = entries.value.find(
        (item) => item.id === proseId.value
    ) as ProseEntry;
});
watch(
    () => route.params.proseId,
    async (newId, oldId) => {
        if (newId && newId !== oldId && newId !== entry.value?.id) {
            entry.value = entries.value.find(
                (item) => item.id === newId
            ) as ProseEntry;
        }
    }
);
</script>

<style scoped>
.prose-detail-view {
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
}

.empty-state {
    min-height: 320px;
    justify-content: center;
    align-items: center;
    color: var(--accent-lavender);
    text-align: center;
}

.error-title {
    margin: 0;
    color: var(--accent-fuschia);
    font-size: 1.1rem;
}

.error-subtitle {
    margin: 0.35rem 0 0.5rem;
    color: var(--main-text);
    opacity: 0.82;
    font-size: 0.92rem;
}

.detail-card,
.comments-card {
    width: 100%;
}

.detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.author-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.date {
    margin: 0.1rem 0 0;
    opacity: 0.75;
    font-size: 0.85rem;
}

.type-pill {
    text-transform: lowercase;
    border: 1px solid var(--accent-fuschia);
    color: var(--accent-fuschia);
    padding: 0.2rem 0.7rem;
    border-radius: 999px;
    font-size: 0.9rem;
}

.title {
    margin: 0;
    color: var(--accent-blue);
    font-size: 1.85rem;
    line-height: 1.25;
}

.markdown-body {
    margin: 0;
    background: rgba(0, 191, 255, 0.06);
    border: 1px solid rgba(0, 191, 255, 0.35);
    border-radius: 0.75rem;
    padding: 0.9rem;
}

.actions-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

@media (max-width: 768px) {
    .prose-detail-view {
        padding: 0.5rem;
    }

    .title {
        font-size: 1.45rem;
    }

    .actions-row {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
