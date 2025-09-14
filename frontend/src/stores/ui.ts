import { DEFAULT_ALERT } from "@/constants";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Alert } from "@/types";

export const useUIStore = defineStore("ui", () => {
    const screenWidth = ref(window.innerWidth);
    const mobileBreakpoint = ref(768);
    const isListenerActive = ref(false);

    const alert = ref(DEFAULT_ALERT);

    const isMobile = computed(() => screenWidth.value < mobileBreakpoint.value);
    const isDesktop = computed(() => screenWidth.value >= 1024);

    const updateScreenWidth = () => {
        screenWidth.value = window.innerWidth;
    };

    const initializeScreenSize = () => {
        if (isListenerActive.value) {
            window.removeEventListener("resize", updateScreenWidth);
        }

        updateScreenWidth();
        window.addEventListener("resize", updateScreenWidth, { passive: true });
    };

    const cleanup = () => {
        window.removeEventListener("resize", updateScreenWidth);
    };

    const showAlert = (incomingAlert: Alert) => {
        alert.value = incomingAlert;
        if (!incomingAlert.dismissable) {
            setTimeout(() => {
                dismissAlert();
            }, incomingAlert.duration);
        }
    };

    const dismissAlert = () => {
        alert.value = DEFAULT_ALERT;
    };

    return {
        alert,
        showAlert,
        dismissAlert,
        screenWidth,
        mobileBreakpoint,
        isMobile,
        isDesktop,
        updateScreenWidth,
        initializeScreenSize,
        cleanup,
    };
});
