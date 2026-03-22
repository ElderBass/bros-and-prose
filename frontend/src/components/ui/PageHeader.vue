<template>
    <div class="header-row">
        <div class="header-leading">
            <BackButton
                v-if="showBack"
                :title="backButtonTitle"
                :can-go-back="canGoBack"
                :fallback-to="fallbackTo"
            />
        </div>
        <div class="header-title">
            <PageTitle
                v-if="!$slots.default"
                :title="title"
                :style="titleStyle"
                class="page-header-page-title"
            />
            <PageTitle
                v-else
                :style="titleStyle"
                class="page-header-page-title"
            >
                <slot />
            </PageTitle>
        </div>
        <div class="header-trailing" aria-hidden="true" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { RouteLocationRaw } from "vue-router";
import { useCanGoBack } from "@/composables/useCanGoBack";
import BackButton from "@/components/ui/BackButton.vue";
import PageTitle from "@/components/ui/PageTitle.vue";

const props = withDefaults(
    defineProps<{
        title?: string;
        titleStyle?: string;
        fallbackTo?: RouteLocationRaw;
        backButtonTitle?: string;
    }>(),
    {
        title: "",
        titleStyle: "",
    }
);

const canGoBack = useCanGoBack();

const showBack = computed(
    () => canGoBack.value || props.fallbackTo !== undefined
);

const backButtonTitle = computed(() => {
    if (props.backButtonTitle) return props.backButtonTitle;
    if (props.title) return props.title;
    return "go back";
});
</script>

<style scoped>
.header-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;
    box-sizing: border-box;
}

.header-leading {
    grid-column: 1;
    justify-self: start;
    display: flex;
    align-items: center;
    padding-left: 0.25rem;
}

.header-title {
    grid-column: 2;
    min-width: 0;
    max-width: min(100vw - 2rem, 100%);
    text-align: center;
}

.header-trailing {
    grid-column: 3;
    min-width: 0;
}

.page-header-page-title {
    width: 100%;
}

.page-header-page-title :deep(.page-title) {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
    max-width: 100%;
}
</style>
