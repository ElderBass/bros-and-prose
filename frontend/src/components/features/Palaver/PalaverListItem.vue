<template>
    <div class="palaver-item" :style="{ '--theme-color': themeColor }">
        <div class="avatar">
            <AvatarImage
                :icon="iconFor(entry.userInfo.avatar)"
                :size="mobile ? 'small' : 'medium'"
            />
        </div>
        <div class="content">
            <div class="meta">
                <span class="type-label">{{ typeLabel }}</span>
                <span class="dot">•</span>
                <span class="timestamp">{{
                    formatDateForDevice(entry.createdAt)
                }}</span>
            </div>
            <p class="stock-text">
                <span class="username">@{{ entry.userInfo.username }}</span>
                {{ stockMessage }}
                <span v-if="entry.type === 'discussion_note'">
                    <span class="book-title">{{
                        entry.bookInfo?.title.toUpperCase()
                    }}</span>
                </span>
                <span v-if="entry.type === 'recommendation'">
                    <span class="book-title">{{
                        entry.recommendation?.title.toUpperCase()
                    }}</span>
                    by
                    <span class="book-author">{{
                        entry.recommendation?.author
                    }}</span>
                </span>
            </p>
            <transition name="fade">
                <div v-if="showDetails" class="details">
                    <BookRecommendationDetails
                        v-if="entry.recommendation"
                        :recommendation="entry.recommendation"
                    />
                    <p class="text">{{ entry.text }}</p>
                </div>
            </transition>
            <div class="toggle">
                <BaseButton
                    size="xsmall"
                    :variant="
                        showDetails ? 'outline-secondary' : 'outline-success'
                    "
                    @click="showDetails = !showDetails"
                >
                    {{ showDetails ? "hide details" : "show details" }}
                </BaseButton>
            </div>
        </div>
    </div>
    <!-- Recommendation-specific CTA could be added here later -->
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import type { PalaverEntry, PalaverType } from "@/types/palaver";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import { AVATAR_ICON_LIST } from "@/constants";
import BookRecommendationDetails from "./BookRecommendationDetails.vue";

const props = defineProps<{ entry: PalaverEntry }>();
const { mobile } = useDisplay();
const showDetails = ref(false);

const iconFor = (iconName: string) => {
    return (
        AVATAR_ICON_LIST.find((i) => i.iconName === iconName) ??
        AVATAR_ICON_LIST.find((i) => i.iconName === "user-astronaut")!
    );
};

const typeLabel = computed(() => {
    switch (props.entry.type) {
        case "discussion_note":
            return "Book Comment";
        case "progress_note":
            return "Progress Update";
        case "suggestion":
            return "App Suggestion";
        case "recommendation":
            return "Book Rec";
        case "misc":
        default:
            return "Some Bullshit";
    }
});

const stockMessage = computed(() => {
    const type = props.entry.type as PalaverType;
    switch (type) {
        case "discussion_note":
            return " has something to say about ";
        case "progress_note":
            return " updated their progress on the current book";
        case "suggestion":
            return " has a suggestion for the app";
        case "recommendation":
            return props.entry.recommendation?.title
                ? " recommended the book "
                : " made a recommendation";
        case "misc":
        default:
            return " has thoughts...";
    }
});

// Mobile-aware date formatter: shorter on mobile, fuller on desktop
const formatDateForDevice = computed(() => {
    return (iso: string) => {
        try {
            const d = new Date(iso);
            console.log(
                "\n\nKERTWANGING mobile.value = ",
                mobile.value,
                "\n\n"
            );
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

const themeColor = computed(() => {
    switch (props.entry.type) {
        case "discussion_note":
            return "var(--accent-lavender)";
        case "progress_note":
            return "var(--accent-fuschia)";
        case "recommendation":
            return "var(--accent-green)";
        case "suggestion":
            return "var(--accent-red)";
        case "misc":
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
    gap: 0.5rem;
}

.meta {
    display: flex;
    align-items: center;
    padding-top: 0.5rem;
    gap: 0.5rem;
    color: var(--main-text);
    opacity: 0.85;
}

.username {
    color: var(--accent-fuschia);
    font-size: 1.25rem;
    font-weight: 600;
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

.book-title {
    font-weight: 600;
    color: var(--accent-blue);
}

.book-author {
    color: var(--accent-fuschia);
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
        padding: 0.75rem;
        gap: 0.5rem;
        width: 100%;
    }
    .username {
        font-size: 1rem;
    }
    .meta {
        padding-top: 0.25rem;
        line-height: 1.2;
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
