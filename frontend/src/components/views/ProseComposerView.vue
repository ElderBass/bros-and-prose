<template>
    <AppLayout>
        <ProseComposerV2 v-if="useV2" />
        <ProseComposerV1 v-else />
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from "@/components/layout/AppLayout.vue";
import ProseComposerV1 from "@/components/features/Prose/Composer/ProseComposerV1.vue";
import ProseComposerV2 from "@/components/features/Prose/Composer/ProseComposerV2.vue";

const useV2 = false;
</script>
