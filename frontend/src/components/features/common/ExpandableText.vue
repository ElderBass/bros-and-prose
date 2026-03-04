<template>
    <div class="text-container">
        <Transition name="text-expand" mode="out-in">
            <div
                :key="showFullText ? 'expanded' : 'collapsed'"
                class="text"
                :class="{ expanded: showFullText, italics: isEmptyText }"
            >
                <slot :displayText="displayText" :showFullText="showFullText">
                    {{ displayText }}
                </slot>
            </div>
        </Transition>
        <div v-if="isLongText" class="show-more-btn-container">
            <button class="show-more-btn" @click="toggleText">
                {{ showFullText ? "show less" : "show more" }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { EMPTY_TEXT } from "@/constants";

const props = withDefaults(
    defineProps<{
        text: string;
        truncateLength?: number;
        isLoggedInUser?: boolean;
    }>(),
    {
        truncateLength: 300,
        isLoggedInUser: false,
    }
);

const showFullText = ref(false);

const isLongText = computed(() => {
    return props.text.length > props.truncateLength;
});

const displayText = computed(() => {
    if (!isLongText.value || showFullText.value) {
        return props.text;
    }
    if (props.isLoggedInUser && props.text === EMPTY_TEXT) {
        return EMPTY_TEXT.replace("homeboy", "you");
    }
    return props.text.substring(0, props.truncateLength) + "...";
});

const isEmptyText = computed(() => {
    return props.text === EMPTY_TEXT;
});

const toggleText = () => {
    showFullText.value = !showFullText.value;
};
</script>

<style scoped>
.text-container {
    background: inherit;
    padding-bottom: 0;
    position: relative;
}

.text {
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--main-text);
    margin: 0;
    padding: 0.5rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    border-left: 1px solid var(--accent-blue);
    border-top: 1px solid var(--accent-blue);
    border-top-left-radius: 0.5rem;
}

.text.italics {
    font-style: italic;
}

.text:not(.expanded) {
    overflow: hidden;
    text-overflow: ellipsis;
}

.text-expand-enter-active,
.text-expand-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

.text-expand-enter-from {
    opacity: 0;
    transform: translateY(10px);
    max-height: 0;
}

.text-expand-enter-to {
    opacity: 1;
    transform: translateY(0);
    max-height: 1000px;
}

.text-expand-leave-from {
    opacity: 1;
    transform: translateY(0);
    max-height: 1000px;
}

.text-expand-leave-to {
    opacity: 0;
    transform: translateY(10px);
    max-height: 0;
}

.show-more-btn-container {
    display: flex;
    justify-content: flex-end;
    padding-top: 0.25rem;
    padding-right: 0.5rem;
}

.show-more-btn {
    background: none;
    border: none;
    color: var(--accent-fuschia);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.3s ease;
}

.show-more-btn:hover {
    color: var(--accent-lavender);
}

@media (max-width: 768px) {
    .text {
        font-size: 1rem;
    }
    .show-more-btn {
        font-size: 0.875rem;
    }
}

@media (max-width: 480px) {
    .text {
        font-size: 0.875rem;
    }
    .show-more-btn {
        font-size: 0.875rem;
    }
}
</style>
