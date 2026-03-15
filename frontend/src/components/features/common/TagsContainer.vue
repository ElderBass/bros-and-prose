<template>
    <div v-if="tags?.length" class="tags">
        <BookTag
            v-for="tag in tags.slice(0, 3)"
            :key="tag"
            :tag="tag"
            :selected="true"
            color="blue"
            :size="mobile ? 'xsmall' : 'small'"
        />
    </div>
    <NoTags v-else :size="mobile ? 'small' : 'medium'" />
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import BookTag from "@/components/ui/BookTag.vue";
import NoTags from "@/components/features/common/NoTags.vue";

defineProps<{
    tags: string[];
}>();

const { mobile } = useDisplay();
</script>

<style scoped>
.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: 0.25rem;
}

.no-tags {
    text-align: center;
    max-width: 60%;
    border: 1px dashed var(--accent-blue);
    border-radius: 1rem;
    padding: 0.5rem;
    font-size: 0.875rem;
    font-style: italic;
    color: var(--main-text);
    opacity: 0.75;
}

@media (min-width: 768px) {
    .tags {
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
}
</style>
