<template>
    <div class="mention-textarea-container">
        <textarea
            ref="textareaRef"
            :id="id"
            class="mention-textarea"
            :value="modelValue"
            @input="onInput"
            @keydown="onKeyDown"
            :aria-label="label"
            :placeholder="placeholder"
            :disabled="disabled"
            :rows="rows"
            :style="style"
        />
        <UserMentionDropdown
            v-if="showDropdown"
            :selectedIndex="selectedIndex"
            :position="dropdownPosition"
            @select="onUserSelect"
            @hover="onUserHover"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, type CSSProperties, onMounted, onBeforeUnmount } from "vue";
import type { User } from "@/types";
import UserMentionDropdown from "@/components/ui/UserMentionDropdown.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const props = withDefaults(
    defineProps<{
        modelValue: string;
        label: string;
        placeholder: string;
        id: string;
        disabled?: boolean;
        rows?: number;
        style?: string | CSSProperties;
    }>(),
    {
        disabled: false,
        rows: 5,
        style: undefined,
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const showDropdown = ref(false);
const mentionStart = ref(-1);
const searchQuery = ref("");
const selectedIndex = ref(0);
const dropdownPosition = ref({ top: 0, left: 0 });

const { allUsersExceptCurrent: users } = storeToRefs(useUserStore());

const getCaretCoordinates = (
    element: HTMLTextAreaElement,
    position: number
) => {
    // Create a mirror div to calculate caret position
    const div = document.createElement("div");
    const style = getComputedStyle(element);
    const properties = [
        "fontFamily",
        "fontSize",
        "fontWeight",
        "letterSpacing",
        "lineHeight",
        "padding",
        "border",
        "width",
        "wordWrap",
        "whiteSpace",
    ];

    properties.forEach((prop) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        div.style[prop as any] = style[prop as any];
    });

    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";

    const textBeforeCaret = element.value.substring(0, position);
    div.textContent = textBeforeCaret;

    const span = document.createElement("span");
    span.textContent = element.value.substring(position) || ".";
    div.appendChild(span);

    document.body.appendChild(div);

    const coordinates = {
        top: span.offsetTop,
        left: span.offsetLeft,
    };

    document.body.removeChild(div);

    // Return coordinates relative to the textarea element itself
    // This allows the dropdown to position correctly within the container
    return {
        top: coordinates.top - element.scrollTop + parseInt(style.fontSize) + 4,
        left: coordinates.left - element.scrollLeft,
    };
};

const onInput = (e: Event) => {
    const el = e.target as HTMLTextAreaElement | null;
    if (!el) return;

    const value = el.value;
    emit("update:modelValue", value);

    const cursorPos = el.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);

    // Find the last @ before cursor
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
        const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);

        // Check if there's a space or newline after @, if so, close dropdown
        if (textAfterAt.includes(" ") || textAfterAt.includes("\n")) {
            showDropdown.value = false;
            return;
        }

        // Show dropdown if we have @ with valid search query
        mentionStart.value = lastAtIndex;
        searchQuery.value = textAfterAt;
        selectedIndex.value = 0;

        if (!showDropdown.value) {
            showDropdown.value = true;
            updateDropdownPosition(el, cursorPos);
        }
    } else {
        showDropdown.value = false;
    }
};

const onKeyDown = (e: KeyboardEvent) => {
    if (!showDropdown.value) return;

    switch (e.key) {
        case "ArrowDown":
            e.preventDefault();
            selectedIndex.value = Math.min(
                selectedIndex.value + 1,
                users.value.length - 1
            );
            break;
        case "ArrowUp":
            e.preventDefault();
            selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
            break;
        case "Enter":
        case "Tab":
            if (users.value.length > 0) {
                e.preventDefault();
                onUserSelect(users.value[selectedIndex.value]);
            }
            break;
        case "Escape":
            e.preventDefault();
            showDropdown.value = false;
            break;
    }
};

const onUserSelect = (user: User) => {
    if (!textareaRef.value) return;

    const currentValue = props.modelValue;
    const beforeMention = currentValue.substring(0, mentionStart.value);
    const afterCursor = currentValue.substring(
        textareaRef.value.selectionStart
    );

    const newValue = `${beforeMention}@${user.username} ${afterCursor}`;
    emit("update:modelValue", newValue);

    showDropdown.value = false;
    searchQuery.value = "";

    // Set cursor position after the mention
    setTimeout(() => {
        if (textareaRef.value) {
            const newCursorPos = mentionStart.value + user.username.length + 2;
            textareaRef.value.selectionStart = newCursorPos;
            textareaRef.value.selectionEnd = newCursorPos;
            textareaRef.value.focus();
        }
    }, 0);
};

const onUserHover = (index: number) => {
    selectedIndex.value = index;
};

const updateDropdownPosition = (el: HTMLTextAreaElement, cursorPos: number) => {
    const coords = getCaretCoordinates(el, cursorPos);
    dropdownPosition.value = coords;
};

const handleClickOutside = (e: MouseEvent) => {
    if (
        showDropdown.value &&
        textareaRef.value &&
        !textareaRef.value.contains(e.target as Node)
    ) {
        // Check if click is on dropdown (handled by mousedown.prevent in dropdown)
        const dropdown = document.querySelector(".user-mention-dropdown");
        if (!dropdown || !dropdown.contains(e.target as Node)) {
            showDropdown.value = false;
        }
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.mention-textarea-container {
    position: relative;
    width: 100%;
}

.mention-textarea {
    width: 100%;
    height: 100%;
    resize: none;
    border: 2px solid var(--accent-blue);
    border-radius: 0.5rem;
    padding: 0.75rem;
    font-family: "Crimson Text", serif;
    font-size: 1.125rem;
    color: var(--main-text);
    background-color: var(--background-color);
}

.mention-textarea::placeholder {
    color: var(--main-text);
    opacity: 0.6;
}

.mention-textarea:focus {
    outline: none;
    border: 2px solid var(--accent-lavender);
}
</style>
