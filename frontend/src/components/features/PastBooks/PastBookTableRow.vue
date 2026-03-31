<template>
    <div
        class="row"
        role="button"
        tabindex="0"
        :title="`peep details for ${book.title}`"
        @click="emitOpen"
        @keydown.enter.prevent="emitOpen"
        @keydown.space.prevent="emitOpen"
    >
        <div class="cell title" data-label="title">
            <span class="title-text">{{ book.title }}</span>
        </div>
        <div class="cell author" data-label="author">
            {{ book.author || "unknown" }}
        </div>
        <div class="cell year" data-label="published">
            {{ book.yearPublished || "—" }}
        </div>
        <div class="cell nominated" data-label="nominated by">
            @{{ nominatorUsername }}
        </div>
        <div class="cell completed" data-label="completed">
            {{ completedDateLabel }}
        </div>
        <div class="cell action" data-label="details" @click.stop>
            <BaseButton
                variant="outline-tertiary"
                size="xsmall"
                title="peep deets'"
                @click.stop="emitOpen"
            >
                <GlassesIcon />
                peep deets
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Book } from "@/types";
import { getBookNominatorUsername } from "@/utils";
import BaseButton from "@/components/ui/BaseButton.vue";
import GlassesIcon from "@/components/icons/GlassesIcon.vue";

const props = defineProps<{
    book: Book;
}>();

const emit = defineEmits<{
    (e: "open", book: Book): void;
}>();

const nominatorUsername = computed(
    () => getBookNominatorUsername(props.book) || "some shmuck"
);

const completedDateLabel = computed(() => {
    const value = props.book.dateCompleted;
    if (!value) return "—";
    try {
        return new Date(value).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return value;
    }
});

const emitOpen = () => emit("open", props.book);
</script>

<style scoped>
.row {
    display: grid;
    grid-template-columns: 2fr 1.4fr 0.7fr 1fr 1fr 0.9fr;
    gap: 0.5rem;
    padding: 0.55rem 0.75rem;
    border-bottom: 1px solid
        color-mix(in srgb, var(--accent-fuschia) 30%, transparent);
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease;
}

.row:hover {
    background-color: color-mix(in srgb, var(--accent-fuschia) 8%, transparent);
}

.row:focus-visible {
    outline: 2px solid var(--accent-fuschia);
    outline-offset: -2px;
}

.cell {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
}

.title-text {
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    font-style: italic;
    font-weight: 600;
}

.author {
    color: var(--accent-blue);
}

.year,
.completed {
    color: var(--main-text);
    opacity: 0.9;
}

.nominated {
    color: var(--accent-lavender);
}

.action {
    justify-content: flex-end;
}

@media (max-width: 768px) {
    .row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        padding: 0.75rem;
    }

    .cell {
        width: 100%;
        white-space: normal;
        font-size: 0.9rem;
        justify-content: space-between;
        gap: 0.6rem;
    }

    .cell::before {
        content: attr(data-label);
        text-transform: lowercase;
        font-size: 0.74rem;
        letter-spacing: 0.03em;
        opacity: 0.75;
        color: var(--accent-green);
        flex: 0 0 5.25rem;
    }

    .cell.title .title-text {
        flex: 1;
        text-align: right;
    }

    .cell.action {
        margin-top: 0.15rem;
        justify-content: flex-end;
    }

    .cell.action::before {
        display: none;
    }
}
</style>
