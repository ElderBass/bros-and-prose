<template>
    <div class="palaver-item" :class="themeClass">
        <div class="avatar">
            <AvatarImage
                :icon="iconFor(entry.userInfo.avatar)"
                :size="mobile ? 'small' : 'medium'"
            />
        </div>
        <div class="content">
            <div class="meta">
                <span class="username">@{{ entry.userInfo.username }}</span>
                <span class="dot">•</span>
                <span class="timestamp">{{
                    formatDateForDevice(entry.createdAt)
                }}</span>
                <span class="type-badge">{{ typeLabel }}</span>
            </div>
            <p class="stock-text">{{ stockMessage }}</p>
            <div class="toggle">
                <BaseButton
                    size="xsmall"
                    :variant="
                        showText ? 'outline-secondary' : 'outline-success'
                    "
                    @click="showText = !showText"
                >
                    {{ showText ? "hide details" : "show details" }}
                </BaseButton>
            </div>
            <transition name="fade">
                <p v-if="showText" class="text">{{ entry.text }}</p>
            </transition>
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
import BaseButton from "@/components/ui/BaseButton.vue";

const props = defineProps<{ entry: PalaverEntry }>();
const { mobile } = useDisplay();
const showText = ref(false);

const iconFor = (iconName: string) => {
    return (
        AVATAR_ICON_LIST.find((i) => i.iconName === iconName) ??
        AVATAR_ICON_LIST.find((i) => i.iconName === "user-astronaut")!
    );
};

const typeLabel = computed(() => props.entry.type.replace("_", " "));

const stockMessage = computed(() => {
    const username = props.entry.userInfo.username;
    const type = props.entry.type as PalaverType;
    switch (type) {
        case "discussion_note":
            return `${username} has something to say about the current book`;
        case "progress_note":
            return `${username} updated their progress on the current book`;
        case "suggestion":
            return `${username} has a suggestion for the app`;
        case "recommendation":
            return props.entry.recommendation?.title
                ? `${username} recommended the book ${props.entry.recommendation.title}`
                : `${username} made a recommendation`;
        case "misc":
        default:
            return `${username} has thoughts...`;
    }
});

// Mobile-aware date formatter: shorter on mobile, fuller on desktop
const formatDateForDevice = computed(() => {
    return (iso: string) => {
        try {
            const d = new Date(iso);
            return mobile.value
                ? d.toLocaleString(undefined, {
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
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

// Theme mapping by type
const themeClass = computed(() => {
    switch (props.entry.type) {
        case "discussion_note":
            return "theme-lavender";
        case "progress_note":
            return "theme-fuschia";
        case "suggestion":
            return "theme-blue";
        case "recommendation":
            return "theme-green";
        case "misc":
        default:
            return "theme-blue";
    }
});
</script>

<style scoped>
.palaver-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid var(--accent-lavender); /* default; themed below */
    border-radius: 1rem;
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.avatar {
    flex-shrink: 0;
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.meta {
    display: flex;
    align-items: center;
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

.type-badge {
    margin-left: auto;
    padding: 0.1rem 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    border: 1px solid var(--accent-blue);
    opacity: 0.9;
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
    margin: 0;
    line-height: 1.6;
}

/* Theme overrides for gradient + shadow (+ border for consistency) */
.theme-lavender {
    border-color: var(--accent-lavender);
    background: linear-gradient(
        180deg,
        rgba(179, 136, 255, 0.06),
        rgba(179, 136, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(179, 136, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
.theme-fuschia {
    border-color: var(--accent-fuschia);
    background: linear-gradient(
        180deg,
        rgba(255, 77, 255, 0.06),
        rgba(255, 77, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(255, 77, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
.theme-green {
    border-color: var(--accent-green);
    background: linear-gradient(
        180deg,
        rgba(57, 255, 20, 0.06),
        rgba(57, 255, 20, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(57, 255, 20, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
.theme-blue {
    border-color: var(--accent-blue);
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
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
        padding: 0.75rem;
    }
}
</style>
