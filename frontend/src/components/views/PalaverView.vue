<template>
    <AppLayout>
        <PageTitle title="palaver" />
        <div class="container">
            <div v-if="isGuestUser()" class="readonly-banner">
                you’re in read-only mode, bro — log in to stir the pot
            </div>

            <PalaverList />
        </div>
        <PalaverFab
            v-if="!isGuestUser() && IS_PALAVER_ENABLED"
            @click="openPalaverItemModal"
        />
        <PalaverItemModal
            v-if="showPalaverItemModal"
            :open="showPalaverItemModal"
            :onClose="closePalaverItemModal"
        />
    </AppLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import PalaverFab from "@/components/features/Palaver/PalaverFab.vue";
import PalaverItemModal from "@/components/modal/PalaverItemModal.vue";
import PalaverList from "@/components/features/Palaver/PalaverList.vue";
import { isGuestUser } from "@/utils";
import { IS_PALAVER_ENABLED } from "@/constants/palaver";

const showPalaverItemModal = ref(false);

const openPalaverItemModal = () => {
    showPalaverItemModal.value = true;
};

const closePalaverItemModal = () => {
    showPalaverItemModal.value = false;
};
</script>

<style scoped>
.container {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    width: 100%;
    height: 100%;
    flex-direction: column;
    gap: 1rem;
}
.composer-wrap {
    margin-bottom: 0.75rem;
}
.readonly-banner {
    margin: 0.5rem 0 1rem;
    padding: 0.5rem 0.75rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 0.75rem;
    background: rgba(0, 191, 255, 0.06);
}
</style>
