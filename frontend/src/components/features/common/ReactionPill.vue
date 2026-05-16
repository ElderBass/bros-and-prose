<template>
    <v-menu
        v-if="hasReactors"
        v-model="menuOpen"
        :open-on-hover="!mobile"
        :open-on-click="false"
        :close-on-content-click="true"
        location="bottom"
        :offset="8"
        content-class="reaction-pill-menu-overlay"
        transition="scale-transition"
    >
        <template #activator="{ props: menuActivatorProps }">
            <span
                v-bind="menuActivatorProps"
                :class="pillClassList"
                :title="title"
                role="button"
                :aria-expanded="menuOpen"
                aria-haspopup="true"
                @click="onActivatorClick"
                @mousedown.stop
                @touchstart.passive="longPress.onTouchStart"
                @touchend="onTouchEnd"
                @touchcancel="longPress.onTouchCancel"
            >
                <FontAwesomeIcon :icon="icon" class="count-icon" />
                <span>{{ count }}</span>
            </span>
        </template>
        <div class="reactor-panel" @click.stop>
            <p class="reactor-heading">{{ headingLabel }}</p>
            <ul class="reactor-list">
                <li
                    v-for="name in sortedReactors"
                    :key="name"
                    class="reactor-row"
                >
                    @{{ name }}
                </li>
            </ul>
        </div>
    </v-menu>
    <span
        v-else
        class="count-pill"
        :class="[`count-pill-${type.toLowerCase()}`, pillSize]"
        :title="title"
    >
        <FontAwesomeIcon :icon="icon" class="count-icon" />
        <span>{{ count }}</span>
    </span>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import type { ReactionType } from "@/types";
import { useLongPress } from "@/composables/useLongPress";
import {
    faThumbsUp,
    faThumbsDown,
    faComment,
    faQuestion,
    faHeart,
} from "@fortawesome/free-solid-svg-icons";

const props = defineProps<{
    type: ReactionType;
    count: number;
    /** Usernames (prose reactions store usernames). */
    reactors?: string[];
    size?: "xsmall" | "small" | "medium";
}>();

const { mobile } = useDisplay();

const menuOpen = ref(false);
const skipNextTapToggle = ref(false);

const hasReactors = computed(
    () => (props.reactors?.length ?? 0) > 0 && props.count > 0
);

const sortedReactors = computed(() =>
    [...(props.reactors ?? [])].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
    )
);

watch(menuOpen, (open) => {
    if (!open) skipNextTapToggle.value = false;
});

const longPress = useLongPress({
    disabled: () => !mobile.value || !hasReactors.value,
    onLongPress: () => {
        skipNextTapToggle.value = true;
        menuOpen.value = true;
    },
});

function onTouchEnd() {
    longPress.onTouchEnd();
}

function onActivatorClick(e: MouseEvent) {
    e.stopPropagation();
    if (!hasReactors.value) return;
    if (!mobile.value) return;
    if (skipNextTapToggle.value) {
        skipNextTapToggle.value = false;
        return;
    }
    menuOpen.value = !menuOpen.value;
}

const pillSize = computed(() => {
    if (props.size) return props.size;
    return mobile.value ? "small" : "medium";
});

const pillClassList = computed(() => [
    "count-pill",
    `count-pill-${props.type.toLowerCase()}`,
    pillSize.value,
]);

const icon = computed(() => {
    switch (props.type) {
        case "like":
            return faThumbsUp;
        case "dislike":
            return faThumbsDown;
        case "comment":
            return faComment;
        case "favorite":
            return faHeart;
        default:
            return faQuestion;
    }
});

const title = computed(() => {
    switch (props.type) {
        case "like":
            return `${props.count} likes`;
        case "dislike":
            return `${props.count} dislikes`;
        case "comment":
            return `${props.count} comments`;
        case "favorite":
            return `${props.count} favorites`;
        default:
            return "";
    }
});

const headingLabel = computed(() => {
    switch (props.type) {
        case "like":
            return "liked by";
        case "dislike":
            return "disliked by";
        case "comment":
            return "commented by";
        case "favorite":
            return "in annals";
        default:
            return "";
    }
});
</script>

<style scoped>
.count-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    cursor: default;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
}

.count-pill.small {
    font-size: 0.75rem;
    padding: 0.175rem 0.35rem;
    gap: 0.25rem;
}

.count-pill.xsmall {
    font-size: 0.65rem;
    padding: 0.1rem 0.25rem;
    gap: 0.15rem;
}

.count-pill.medium {
    font-size: 1.25rem;
    padding: 0.25rem 0.65rem;
    gap: 0.5rem;
}

.count-pill-like {
    background-color: color-mix(in srgb, var(--accent-green) 25%, transparent);
    border: 1px solid var(--accent-green);
    color: var(--accent-green);
}

.count-pill-dislike {
    background-color: color-mix(in srgb, var(--accent-red) 25%, transparent);
    border: 1px solid var(--accent-red);
    color: var(--accent-red);
}

.count-pill-comment {
    background-color: color-mix(in srgb, var(--accent-blue) 25%, transparent);
    border: 1px solid var(--accent-blue);
    color: var(--accent-blue);
}

.count-pill-favorite {
    background-color: color-mix(in srgb, var(--accent-pink) 25%, transparent);
    border: 1px solid var(--accent-pink);
    color: var(--accent-pink);
}

.count-icon {
    font-size: inherit;
}

.reactor-panel {
    min-width: 11rem;
    max-width: min(90vw, 18rem);
    padding: 0.5rem 0.65rem 0.65rem;
    background: var(--surface-color);
    border: 1px solid
        color-mix(in srgb, var(--accent-lavender) 40%, transparent);
    border-radius: 0.65rem;
}

.reactor-heading {
    margin: 0 0 0.35rem;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: lowercase;
    letter-spacing: 0.04em;
    opacity: 0.85;
    color: var(--accent-lavender);
}

.reactor-list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 11rem;
    overflow-y: auto;
}

.reactor-row {
    padding: 0.2rem 0;
    font-size: 0.88rem;
    color: var(--main-text);
    line-height: 1.35;
}
</style>

<style>
.reaction-pill-menu-overlay {
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}
</style>
