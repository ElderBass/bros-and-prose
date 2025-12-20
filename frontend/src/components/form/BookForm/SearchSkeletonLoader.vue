<template>
    <SkeletonLoader
        :count="5"
        type="list-item-avatar-two-line"
        :height="76"
        tone="blue"
    />
</template>

<script setup lang="ts">
import SkeletonLoader from "@/components/ui/SkeletonLoader.vue";
</script>
