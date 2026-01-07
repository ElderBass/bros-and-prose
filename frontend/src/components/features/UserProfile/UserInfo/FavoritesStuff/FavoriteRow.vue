<template>
    <div class="fav-row">
        <div class="header">
            <span class="fav-label">{{ label }}:</span>
            <IconButton
                v-if="isLoggedInUser"
                :size="buttonSize"
                :color="hasItems ? 'fuschia' : 'green'"
                :icon="hasItems ? faMarker : faPlus"
                :title="`${hasItems ? 'edit' : 'add'} ${label}`"
                :handleClick="onAddItem"
            />
        </div>
        <span v-if="hasItems" class="fav-value">{{ itemsCommaString }}</span>
        <span v-else class="fav-empty">none</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { FavoriteType } from "@/types/user";
import { faMarker, faPlus } from "@fortawesome/free-solid-svg-icons";

const { label, items, isLoggedInUser } = defineProps<{
    label: FavoriteType;
    items: string[];
    isLoggedInUser: boolean;
}>();

const emit = defineEmits<{
    (e: "addItem", type: FavoriteType): void;
}>();

const { mobile } = useDisplay();

const buttonSize = computed(() => {
    return mobile.value ? "supersmall" : "xsmall";
});

const itemsCommaString = computed(() => {
    return items.join(", ");
});

const hasItems = computed(() => {
    return items.length > 0;
});

const onAddItem = (type: FavoriteType) => {
    emit("addItem", type);
};
</script>

<style scoped>
.fav-row {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.fav-label {
    font-weight: 600;
}

.fav-value {
    font-weight: 400;
    color: var(--accent-blue);
}

.fav-empty {
    flex: 1 0 50%;
    font-weight: 400;
    color: var(--main-text);
    opacity: 0.75;
    font-style: italic;
    text-align: center;
    border: 1px dashed var(--accent-blue);
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
}
</style>
