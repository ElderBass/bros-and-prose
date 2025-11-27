<template>
    <div class="comment-button">
        <IconButton
            title="cheeky comment"
            :size="mobile ? 'xsmall' : 'small'"
            color="blue"
            :icon="faCommentMedical"
            :handleClick="() => setShowAddCommentModal(true)"
        />
        <ReactionCountBadge :count="commentCount" color="blue" />
    </div>
    <AddCommentModal
        v-if="showAddCommentModal"
        :open="showAddCommentModal"
        :isItemComment="true"
        @submit="submitComment"
        @close="() => setShowAddCommentModal(false)"
    />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import type { Comment, PalaverEntry } from "@/types";
import AddCommentModal from "@/components/modal/AddCommentModal.vue";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";
import { usePalaver } from "@/composables/usePalaver";
import { useLog } from "@/composables";
import { useUIStore } from "@/stores/ui";
import { ADDED_COMMENT_SUCCESS_ALERT, QUICK_ERROR } from "@/constants";
import ReactionCountBadge from "./ReactionCountBadge.vue";

const { mobile } = useDisplay();
const { showAlert } = useUIStore();

const props = defineProps<{ entry: PalaverEntry }>();

const showAddCommentModal = ref(false);
const submitting = ref(false);

const setShowAddCommentModal = (value: boolean) => {
    showAddCommentModal.value = value;
};

const commentCount = computed(() => {
    return Object.values(props.entry.comments || {}).length;
});

const submitComment = async (comment: Comment) => {
    try {
        submitting.value = true;
        await usePalaver().addComment(props.entry, comment);
        setShowAddCommentModal(false);
        showAlert(ADDED_COMMENT_SUCCESS_ALERT);
    } catch (error) {
        console.error("Error submitting comment:", error);
        await useLog().error(`Err",or submitting comment: ${error}`);
        showAlert(
            QUICK_ERROR([
                "oof, bud, this error happend: ",
                (error as Error).message,
            ])
        );
    } finally {
        submitting.value = false;
    }
};
</script>

<style scoped>
.comment-button {
    position: relative;
}
</style>
