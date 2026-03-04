<template>
    <div class="palaver-item" :style="{ '--theme-color': themeColor }">
        <div class="avatar">
            <AvatarImage
                :avatar="entry.userInfo.avatar"
                :avatarType="entry.userInfo.avatarType || 'icon'"
                :size="mobile ? 'small' : 'medium'"
            />
        </div>
        <div class="content">
            <div class="header-content">
                <div class="meta">
                    <span class="type-label">{{ typeLabel }}</span>
                    <span class="dot">•</span>
                    <span class="timestamp">{{
                        formatDateForDevice(entry.createdAt)
                    }}</span>
                </div>
                <ListItemActions v-if="!isGuestUser()" :entry="entry" />
            </div>

            <p class="stock-text">
                <UsernameLink
                    :username="entry.userInfo.username"
                    :fontSize="mobile ? 'small' : 'medium'"
                />
                {{ stockMessage }}
                <BookInfo
                    v-if="showBookInfo"
                    :title="
                        entry.bookInfo?.title ||
                        entry.recommendation?.title ||
                        ''
                    "
                    :author="
                        entry.bookInfo?.author ||
                        entry.recommendation?.author ||
                        ''
                    "
                />
            </p>
            <BookRecommendationDetails
                v-if="entry.recommendation"
                :recommendation="entry.recommendation"
            />
            <BookRatingInput
                v-if="entry.rating"
                :model-value="entry.rating"
                :size="mobile ? 'xsmall' : 'medium'"
                :readOnly="true"
            />
            <ExpandableText :text="entry.text || EMPTY_TEXT">
                <template #default="{ displayText }">
                    <MentionText :text="displayText" fontSize="small" />
                </template>
            </ExpandableText>
            <ReactionDetails
                v-if="entry.likes || entry.dislikes"
                :likes="entry.likes || []"
                :dislikes="entry.dislikes || []"
            />
            <transition name="fade">
                <CommentsSection
                    v-if="showComments"
                    :entry="entry"
                    :variant="themeVariant"
                />
            </transition>
            <div class="toggle">
                <BaseButton
                    v-if="hasComments"
                    size="xsmall"
                    :variant="
                        showComments ? 'outline-secondary' : 'outline-success'
                    "
                    @click="showComments = !showComments"
                >
                    {{ showComments ? "hide comments" : "show comments" }}
                </BaseButton>
            </div>
        </div>
    </div>
    <!-- Recommendation-specific CTA could be added here later -->
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import MentionText from "@/components/ui/MentionText.vue";
import ListItemActions from "@/components/features/Palaver/PalaverListItem/ListItemActions.vue";
import ReactionDetails from "@/components/features/Palaver/PalaverListItem/ReactionDetails.vue";
import BookRecommendationDetails from "@/components/features/Palaver/PalaverListItem/BookRecommendationDetails.vue";
import type { PalaverEntry, PalaverType } from "@/types/palaver";
import { EMPTY_TEXT } from "@/constants";
import { isGuestUser } from "@/utils";
import CommentsSection from "./CommentsSection.vue";
import BookInfo from "./BookInfo.vue";
import BookRatingInput from "@/components/form/BookRatingInput.vue";
import ExpandableText from "@/components/features/common/ExpandableText.vue";

defineOptions({ name: "PalaverListItem" });

const props = withDefaults(
    defineProps<{
        entry: PalaverEntry;
        isInbrospection?: boolean;
    }>(),
    {
        isInbrospection: false,
    }
);
const { mobile } = useDisplay();

const showComments = ref(false);

const hasComments = computed(() => {
    return props.entry.comments && props.entry.comments.length > 0;
});

const typeLabel = computed(() => {
    switch (props.entry.type) {
        case "discussion_note":
            return props.isInbrospection ? "Comment" : "Book Comment";
        case "progress_note":
            return props.isInbrospection ? "Progress" : "Progress Update";
        case "suggestion":
            return "App Suggestion";
        case "recommendation":
            return "Book Rec";
        case "review":
            return "Book Review";
        case "misc":
        default:
            return "Some Bullshit";
    }
});

const stockMessage = computed(() => {
    const type = props.entry.type as PalaverType;
    switch (type) {
        case "discussion_note":
            return " said some shit about ";
        case "progress_note":
            return " made progress on the current book";
        case "suggestion":
            return " suggested an idea for the app";
        case "recommendation":
            return props.entry.recommendation?.title
                ? " recommended "
                : " made a recommendation";
        case "review":
            return " reviewed ";
        case "misc":
        default:
            return " has thoughts...";
    }
});

const showBookInfo = computed(() => {
    return (
        props.entry.type === "recommendation" ||
        props.entry.type === "review" ||
        props.entry.type === "discussion_note"
    );
});

// Mobile-aware date formatter: shorter on mobile, fuller on desktop
const formatDateForDevice = computed(() => {
    return (iso: string) => {
        try {
            const d = new Date(iso);
            return mobile.value === true
                ? d.toLocaleString(undefined, {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                  })
                : d.toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                  });
        } catch {
            return iso;
        }
    };
});

const themeVariant = computed(() => {
    switch (props.entry.type) {
        case "discussion_note":
        case "review":
            return "lavender";
        case "progress_note":
            return "fuschia";
        case "recommendation":
            return "green";
        case "suggestion":
            return "red";
        case "misc":
        default:
            return "blue";
    }
});

const themeColor = computed(() => {
    switch (themeVariant.value) {
        case "lavender":
            return "var(--accent-lavender)";
        case "fuschia":
            return "var(--accent-fuschia)";
        case "green":
            return "var(--accent-green)";
        case "red":
            return "var(--accent-red)";
        case "blue":
        default:
            return "var(--accent-blue)";
    }
});
</script>

<style scoped>
.palaver-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    font-size: 1.25rem;
    width: 60%;
    border: 2px solid var(--theme-color); /* themed via CSS var */
    border-radius: 1rem;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--theme-color) 12%, transparent),
        color-mix(in srgb, var(--theme-color) 6%, transparent)
    );
    box-shadow:
        0 4px 20px color-mix(in srgb, var(--theme-color) 25%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.avatar {
    flex-shrink: 0;
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.meta {
    display: flex;
    align-items: center;
    padding-top: 0.5rem;
    gap: 0.5rem;
    color: var(--main-text);
    opacity: 0.85;
}

.dot {
    opacity: 0.6;
}

.timestamp {
    font-size: 0.9rem;
}

.type-label {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--theme-color);
}

.stock-text {
    margin: 0;
    line-height: 1.4;
    opacity: 0.95;
}

.toggle {
    display: flex;
    justify-content: flex-end;
}

.text {
    font-size: 1.125rem;
    margin: 0;
    line-height: 1.6;
    padding: 0.5rem;
    padding-left: 0.75rem;
    margin-right: 1rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    border-left: 1px solid var(--accent-blue);
    border-top: 1px solid var(--accent-blue);
    border-top-left-radius: 0.5rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@media (max-width: 768px) {
    .palaver-item {
        font-size: 1rem;
        gap: 0.5rem;
        width: 100%;
    }
    .content {
        gap: 0.5rem;
    }
    .meta {
        padding-top: 0.25rem;
        line-height: 1.2;
        gap: 0.25rem;
    }
    .type-label {
        font-size: 1rem;
    }
    .text {
        font-size: 1rem;
        padding: 0.5rem;
    }
}
</style>
