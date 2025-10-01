<template>
    <div class="error-boundary">
        <div v-if="hasError" class="fallback">
            <BaseCard shadow-color="lavender" size="medium">
                <div class="fallback-content">
                    <h2 class="title">something broke, bro</h2>
                    <p class="subtitle">
                        we faceplanted into an unexpected error.
                    </p>
                    <p v-if="errorMessage" class="details">
                        {{ errorMessage }}
                    </p>
                    <div class="actions">
                        <BaseButton variant="outline" @click="reset"
                            >try again</BaseButton
                        >
                        <BaseButton variant="outline-secondary" @click="goHome"
                            >take me home</BaseButton
                        >
                    </div>
                </div>
            </BaseCard>
        </div>
        <div v-else class="content">
            <RouterView :key="viewKey" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useLog } from "@/composables/useLog";
import { onMounted, onBeforeUnmount, onErrorCaptured, ref } from "vue";
import { RouterView, useRouter } from "vue-router";

const router = useRouter();

const hasError = ref(false);
const errorMessage = ref("");
const viewKey = ref(0);

const reset = () => {
    hasError.value = false;
    errorMessage.value = "";
    // Force re-mount of the routed component
    viewKey.value++;
};

const goHome = () => {
    router.push("/");
};

onErrorCaptured((err) => {
    const message = (err as Error)?.message ?? String(err);
    hasError.value = true;
    errorMessage.value = message;
    const log = {
        message,
        level: "error",
        timestamp: new Date().toISOString(),
        isError: true,
    };
    void useLog().postLog(log);
    // prevent further propagation
    return false;
});

const onGlobalError = async (event: ErrorEvent) => {
    const log = {
        message: event.message,
        level: "error",
        timestamp: new Date().toISOString(),
        isError: true,
    };
    await useLog().postLog(log);
};

const onUnhandledRejection = async (event: PromiseRejectionEvent) => {
    const message =
        (event.reason && event.reason.message) || "unhandled rejection";

    const log = {
        message,
        level: "error",
        timestamp: new Date().toISOString(),
        isError: true,
    };
    await useLog().postLog(log);
};

onMounted(() => {
    window.addEventListener("error", onGlobalError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
});

onBeforeUnmount(() => {
    window.removeEventListener("error", onGlobalError);
    window.removeEventListener("unhandledrejection", onUnhandledRejection);
});
</script>

<style scoped>
.error-boundary {
    width: 100%;
    height: 100%;
}

.content {
    width: 100%;
    height: 100%;
}

.fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100vh - 4rem);
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
}

.details {
    margin: 0;
    opacity: 0.7;
    font-size: 0.95rem;
}

.actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
}
</style>
