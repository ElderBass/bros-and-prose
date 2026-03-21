<template>
    <AppLayout>
        <ProseComposerV2 v-if="useV2ProseComposer" />
        <ProseComposerV1 v-else />
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from "@/components/layout/AppLayout.vue";
import ProseComposerV1 from "@/components/features/Prose/Composer/ProseComposerV1.vue";
import ProseComposerV2 from "@/components/features/Prose/Composer/ProseComposerV2.vue";
import { useV2ProseComposer } from "@/constants/features";
</script>
