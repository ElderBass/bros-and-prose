<template>
    <div class="manual-mode-suggestion">
        <h6>ain't finding your shit?</h6>
        <p>
            use
            <a
                v-if="latestQuery"
                :href="`https://www.google.com/search?q=${latestQuery}-book`"
                target="_blank"
                >this link</a
            >
            for deets, then enter them manually
        </p>
        <BaseButton
            variant="outline"
            title="fuck it, we'll do it live"
            :size="buttonSize"
            @click="emit('manualMode')"
        >
            enter deets manually
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";

defineProps<{
    latestQuery?: string;
}>();

const emit = defineEmits<{
    (e: "manualMode"): void;
}>();

const { mobile } = useDisplay();

const buttonSize = computed(() => {
    return mobile.value ? "xsmall" : "small";
});
</script>

<style scoped>
.manual-mode-suggestion {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
    border: 1px solid var(--accent-fuschia);
    border-radius: 1rem;
}

h6 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--accent-fuschia);
}

p {
    font-size: 0.9rem;
    color: var(--main-text);
}

a {
    font-size: 0.9rem;
    color: var(--accent-lavender);
    text-decoration: underline;
    cursor: pointer;
}

@media (min-width: 768px) {
    .manual-mode-suggestion {
        max-width: 75%;
        align-self: center;
        gap: 0.75rem;
        padding: 1rem 2rem;
    }
    h6 {
        font-size: 1.25rem;
    }
    p {
        font-size: 1rem;
    }
    a {
        font-size: 1rem;
    }
}
</style>
