<template>
    <AppLayout>
        <div class="header-wrap">
            <PageHeader title="prose details" :fallback-to="'/prose'" />
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
                    <div class="header-actions">
                        <span class="type-pill">{{ entry.type }}</span>
                        <EditButton
                            v-if="isAuthor"
                            title="edit this prose"
                            :handleEdit="goToEdit"
                            button-size="small"
                        />
                    </div>
                </div>

                <h2 class="title">{{ entry.title }}</h2>
                <BlurbSection
                    v-if="entry.excerpt?.trim()"
                    :blurb="entry.excerpt"
                />
                <div class="markdown-body">
                    <MarkdownContentV2
                        v-if="useV2ProseComposer"
                        :markdown="entry.markdown"
                    />
                    <MarkdownContentV1 v-else :markdown="entry.markdown" />
                </div>

                <div class="actions-row">
                    <ProseEntryReactionActions
                        v-if="!isGuestUser() && !isAuthor"
                        :entry="entry"
                        @entry-updated="onEntryUpdated"
                    />
                    <ProseReactionPills
                        v-else
                        :likes="entry.likes"
                        :dislikes="entry.dislikes"
                        :favorites="entry.favorites"
                        :comments="entry.comments"
                    />
                    <div v-if="!isGuestUser()" class="entry-actions">
                        <IconButton
                            v-if="!isAuthor"
                            :icon="
                                isProseFavorited ? faHeartSolid : faHeartRegular
                            "
                            color="pink"
                            size="small"
                            :title="
                                isProseFavorited
                                    ? 'remove this prose from your annals'
                                    : 'add this prose to your annals'
                            "
                            :disabled="savingEntry"
                            :handleClick="toggleFavoriteState"
                        />
                        <BaseButton
                            variant="outline"
                            size="small"
                            title="add a cheeky comment, don't hold back"
                            :showTooltip="false"
                            class="comment-btn"
                            @click="onCheekyFeedbackClick"
                        >
                            <FontAwesomeIcon :icon="faCommentMedical" />
                            <span class="comment-btn-text"
                                >cheeky feedback</span
                            >
                        </BaseButton>
                    </div>
                </div>
            </BaseCard>

            <BaseCard
                shadow-color="lavender"
                :size="cardSize"
                class="comments-card"
            >
                <ProseCommentsSection
                    ref="proseCommentsSectionRef"
                    :entry="entry"
                    @entry-updated="onEntryUpdated"
                />
            </BaseCard>
        </div>
    </AppLayout>

    <AddCommentModal
        v-if="!useV2ProseComments && showCommentModal"
        :open="showCommentModal"
        :isItemComment="true"
        :maxCommentLength="50000"
        :submitting="submittingComment"
        @submit="submitComment"
        @close="showCommentModal = false"
    />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import AppLayout from "@/components/layout/AppLayout.vue";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import AddCommentModal from "@/components/modal/AddCommentModal.vue";
import ProseEntryReactionActions from "@/components/features/Prose/ProseEntryReactionActions.vue";
import ProseCommentsSection from "@/components/features/Prose/Comments/ProseCommentsSection.vue";
import MarkdownContentV1 from "@/components/features/common/MarkdownContentV1.vue";
import MarkdownContentV2 from "@/components/features/common/MarkdownContentV2.vue";
import BlurbSection from "@/components/features/Prose/ProseDetail/BlurbSection.vue";
import ProseReactionPills from "@/components/features/Prose/ProseReactionPills.vue";
import EditButton from "@/components/ui/EditButton.vue";
import IconButton from "@/components/ui/IconButton.vue";
import { useProse } from "@/composables/useProse";
import { useProseStore } from "@/stores/prose";
import { useUIStore } from "@/stores/ui";
import { useUserStore } from "@/stores/user";
import { useUserFavorites } from "@/composables";
import { ADDED_COMMENT_SUCCESS_ALERT, QUICK_ERROR } from "@/constants";
import type { Comment, ProseEntry } from "@/types";
import { isGuestUser } from "@/utils";
import { useLog } from "@/composables";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useV2ProseComposer, useV2ProseComments } from "@/constants/features";

const route = useRoute();
const router = useRouter();
const { mobile } = useDisplay();
const proseStore = useProseStore();
const { showAlert } = useUIStore();
const { addComment, getProseEntry } = useProse();

const { entries } = storeToRefs(proseStore);
const { loggedInUser } = storeToRefs(useUserStore());

const proseId = computed(() => String(route.params.proseId || ""));
const isAuthor = computed(
    () => entry.value?.userInfo?.id === loggedInUser.value?.id
);

const goToEdit = () => {
    if (entry.value?.id) router.push(`/prose/edit/${entry.value.id}`);
};

const loading = ref(false);
const showCommentModal = ref(false);
const submittingComment = ref(false);
const proseCommentsSectionRef = ref<{
    openComposer: () => void;
} | null>(null);
const savingEntry = ref(false);
const entry = ref<ProseEntry | undefined>(undefined);

const normalizeProseFavorites = (raw: unknown): ProseEntry[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw as ProseEntry[];
    if (typeof raw === "object") return Object.values(raw) as ProseEntry[];
    return [];
};

const isProseFavorited = computed(() => {
    if (!entry.value?.id) return false;
    const proseFavs = normalizeProseFavorites(
        loggedInUser.value?.favorites?.prose
    );
    return proseFavs.some((p) => p.id === entry.value?.id);
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

const onEntryUpdated = (e: ProseEntry) => {
    entry.value = e;
};

const onCheekyFeedbackClick = () => {
    if (useV2ProseComments) {
        proseCommentsSectionRef.value?.openComposer();
    } else {
        showCommentModal.value = true;
    }
};

const submitComment = async (comment: Comment) => {
    if (!entry.value) return;
    submittingComment.value = true;
    try {
        const updated = await addComment(entry.value, comment);
        if (updated) entry.value = updated;
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

const toggleFavoriteState = async () => {
    if (!entry.value?.id || savingEntry.value) return;
    savingEntry.value = true;
    try {
        const currentFavorites = normalizeProseFavorites(
            loggedInUser.value?.favorites?.prose
        );
        const wasFavorited = currentFavorites.some(
            (p) => p.id === entry.value?.id
        );

        const updatedFavorites = wasFavorited
            ? currentFavorites.filter((p) => p.id !== entry.value?.id)
            : [...currentFavorites, entry.value];

        await useUserFavorites().updateFavorite("prose", updatedFavorites);

        if (wasFavorited) {
            await useProse().unfavoriteProseEntry(entry.value);
        } else {
            await useProse().favoriteProseEntry(entry.value);
        }
    } catch (error) {
        await useLog().error(`Error toggling favorite prose: ${error}`);
        showAlert(
            QUICK_ERROR([
                "failed to update favorite prose",
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

.header-wrap {
    width: 100%;
    max-width: 820px;
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
    padding: 0.5rem;
}

.detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.25rem;
    gap: 1rem;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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
    flex-wrap: wrap;
}

.entry-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.comment-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
}

@media (max-width: 768px) {
    .prose-detail-view {
        padding: 0.5rem;
        gap: 0.65rem;
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
        gap: 0.75rem;
        flex-wrap: nowrap;
    }

    .entry-actions {
        gap: 0.35rem;
    }

    .comment-btn-text {
        display: none;
    }

    .comment-btn {
        min-width: auto;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }

    .empty-state {
        min-height: 200px;
        font-size: 0.9rem;
    }
}
</style>
