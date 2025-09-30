<template>
    <AppLayout>
        <div class="four-oh-four">
            <PageTitle
                style="width: fit-content"
                title="404 — this page ain't in the canon"
            />
            <div class="fallback">
                <BaseCard shadow-color="lavender" size="medium">
                    <h2 class="title">wtf bro</h2>
                    <div class="fallback-content">
                        <p class="subtitle">
                            either this page never existed or it got yeeted to
                            the void.
                        </p>
                        <div class="actions">
                            <BaseButton variant="outline" @click="goPresent"
                                >to the present</BaseButton
                            >
                            <BaseButton
                                variant="outline-secondary"
                                @click="goProfile"
                                >profile</BaseButton
                            >
                        </div>
                    </div>
                </BaseCard>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import AppLayout from "../layout/AppLayout.vue";

const router = useRouter();

const goPresent = () => router.push("/present");
const goProfile = () => router.push("/profile");
</script>

<style scoped>
.four-oh-four {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
}

.fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1rem;
}

.fallback-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    text-align: center;
}

.title {
    margin: 0;
    color: var(--accent-fuschia);
}

.subtitle {
    margin: 0;
    opacity: 0.9;
    font-size: 1.25rem;
}

.actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
}

@media (min-width: 768px) {
    .fallback {
        width: 50%;
    }
}
</style>
