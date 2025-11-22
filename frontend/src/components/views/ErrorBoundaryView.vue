<template>
    <div class="error-boundary">
        <div v-if="hasError" class="fallback">
            <AppHeader />
            <main class="error-content">
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
                            <BaseButton
                                variant="outline"
                                :size="mobile ? 'small' : 'medium'"
                                @click="reset"
                                >try again</BaseButton
                            >
                            <BaseButton
                                variant="outline-secondary"
                                :size="mobile ? 'small' : 'medium'"
                                @click="goHome"
                                >take me home</BaseButton
                            >
                        </div>
                    </div>
                </BaseCard>
            </main>
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
import AppHeader from "../layout/AppHeader.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

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
        stack: (err as Error)?.stack,
        level: "error",
        timestamp: new Date().toISOString(),
        isError: true,
    };
    console.log("KERTWANGING log in onErrorCaptured", log);
    void useLog().postLog(log);
    // prevent further propagation
    return false;
});

const onGlobalError = async (event: ErrorEvent) => {
    const log = {
        message: event.message,
        stack: event.error.stack,
        level: "error",
        timestamp: new Date().toISOString(),
        isError: true,
    };
    console.log("KERTWANGING log in onGlobalError", log);
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
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.error-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 8rem;
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

@media (max-width: 768px) {
    .error-content {
        padding: 4rem 1rem;
    }
}
</style>
