<template>
    <AppLayout>
        <div class="header-row">
            <RouterLink to="/prose" class="back-link">
                <FontAwesomeIcon :icon="faArrowLeft" />
            </RouterLink>
            <PageTitle title="prose details" />
        </div>

        <LoadingSpinnerContainer
            v-if="loading"
            size="large"
            message="loading prose details..."
        />
        <div v-else-if="!entry" class="prose-detail-view empty-state">
            <p>couldn't find that prose piece.</p>
        </div>

        <div v-else class="prose-detail-view">
            <BaseCard shadow-color="blue" :size="cardSize" class="detail-card">
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
                    <ProseEntryReactionActions
                        v-if="!isGuestUser() && !isAuthor"
                        :entry="entry"
                    />
                    <div v-if="!isGuestUser()" class="entry-actions">
                        <BaseButton
                            v-if="!isAuthor"
                            :variant="
                                isEntrySaved
                                    ? 'outline-success'
                                    : 'outline-tertiary'
                            "
                            size="small"
                            :title="
                                isEntrySaved
                                    ? 'remove this prose from your annals'
                                    : 'add this prose to your annals'
                            "
                            :showTooltip="false"
                            :disabled="savingEntry"
                            @click="toggleSavedState"
                        >
                            {{ isEntrySaved ? "saved" : "save prose" }}
                        </BaseButton>
                        <BaseButton
                            variant="outline"
                            size="small"
                            title="add a cheeky comment, don't hold back"
                            :showTooltip="false"
                            @click="showCommentModal = true"
                        >
                            <FontAwesomeIcon :icon="faCommentMedical" />
                            cheeky feedback
                        </BaseButton>
                    </div>
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
import { useDisplay } from "vuetify";
import AppLayout from "@/components/layout/AppLayout.vue";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import AddCommentModal from "@/components/modal/AddCommentModal.vue";
import ProseEntryReactionActions from "@/components/features/Prose/ProseEntryReactionActions.vue";
import ProseCommentsSection from "@/components/features/Prose/ProseCommentsSection.vue";
import MarkdownContent from "@/components/features/common/MarkdownContent.vue";
import { useProse } from "@/composables/useProse";
import { useProseStore } from "@/stores/prose";
import { useUIStore } from "@/stores/ui";
import { useUserStore } from "@/stores/user";
import { ADDED_COMMENT_SUCCESS_ALERT, QUICK_ERROR } from "@/constants";
import type { Comment, ProseEntry } from "@/types";
import { isGuestUser } from "@/utils";
import { useLog } from "@/composables";
import {
    faArrowLeft,
    faCommentMedical,
} from "@fortawesome/free-solid-svg-icons";
const route = useRoute();
const { mobile } = useDisplay();

const proseId = computed(() => String(route.params.proseId || ""));

const proseStore = useProseStore();
const { entries } = storeToRefs(proseStore);
const { addComment, getProseEntry, toggleSavedProseEntry } = useProse();
const { showAlert } = useUIStore();
const { loggedInUser } = storeToRefs(useUserStore());

const isAuthor = computed(
    () => entry.value?.userInfo?.id === loggedInUser.value?.id
);

const loading = ref(false);
const showCommentModal = ref(false);
const submittingComment = ref(false);
const savingEntry = ref(false);
const entry = ref<ProseEntry | undefined>(undefined);

const isEntrySaved = computed(() => {
    if (!entry.value?.id) return false;
    return proseStore.isSaved(entry.value.id);
});

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

const cardSize = computed(() => {
    return mobile.value ? "small" : "medium";
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

const toggleSavedState = async () => {
    if (!entry.value?.id || savingEntry.value) return;
    savingEntry.value = true;
    try {
        const wasSaved = isEntrySaved.value;
        await toggleSavedProseEntry(entry.value.id);
        showAlert({
            show: true,
            messages: [
                wasSaved
                    ? "prose removed from saved."
                    : "prose saved for later.",
            ],
            type: "success",
            duration: 3000,
            dismissable: false,
        });
    } catch (error) {
        await useLog().error(`Error toggling saved prose: ${error}`);
        showAlert(
            QUICK_ERROR([
                "failed to update saved prose",
                (error as Error).message || "unknown error",
            ])
        );
    } finally {
        savingEntry.value = false;
    }
};
onMounted(async () => {
    const storedEntry = entries.value.find(
        (item) => item.id === proseId.value
    ) as ProseEntry;
    if (storedEntry) {
        entry.value = storedEntry;
    } else {
        entry.value = (await getProseEntry(proseId.value)) as ProseEntry;
    }
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

.header-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.back-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    color: var(--accent-blue);
    border: 2px solid var(--accent-blue);
    border-radius: 50%;
    padding: 0.5rem;
    text-decoration: none;
    transition:
        color 0.3s ease,
        background-color 0.3s ease,
        border-color 0.3s ease,
        transform 0.3s ease;
}

.back-link:hover {
    color: var(--accent-fuschia);
    background-color: rgba(255, 77, 255, 0.1);
    border-color: var(--accent-fuschia);
    transform: scale(1.1);
}

.back-link:active {
    transform: scale(0.95);
}

.back-link:focus-visible {
    outline: 2px solid var(--accent-blue);
    outline-offset: 2px;
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
    padding: 0.5rem;
}

.detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.25rem;
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
    padding-left: 0.5rem;
    color: var(--accent-blue);
    font-size: 1.25rem;
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
    justify-content: flex-end;
    gap: 0.75rem;
}

.entry-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .prose-detail-view {
        padding: 0.5rem;
        gap: 0.65rem;
    }

    .header-row {
        gap: 0.5rem;
    }

    .back-link {
        width: 2rem;
        height: 2rem;
        padding: 0.35rem;
    }

    .detail-header {
        gap: 0.5rem;
    }

    .author-meta {
        gap: 0.5rem;
    }

    .date {
        font-size: 0.75rem;
    }

    .type-pill {
        padding: 0.15rem 0.5rem;
        font-size: 0.75rem;
    }

    .title {
        font-size: 1rem;
    }

    .markdown-body {
        padding: 0.6rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        line-height: 1.5;
    }

    .markdown-body :deep(h1),
    .markdown-body :deep(h2),
    .markdown-body :deep(h3),
    .markdown-body :deep(h4),
    .markdown-body :deep(h5),
    .markdown-body :deep(h6) {
        font-size: 0.95em;
    }

    .actions-row {
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
    }

    .entry-actions {
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        gap: 0.4rem;
    }

    .empty-state {
        min-height: 200px;
        font-size: 0.9rem;
    }
}
</style>
