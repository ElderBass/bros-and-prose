import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUIStore = defineStore("ui", () => {
    const screenWidth = ref(window.innerWidth);
    const mobileBreakpoint = ref(768);
    const isListenerActive = ref(false);

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

    return {
        screenWidth,
        mobileBreakpoint,
        isMobile,
        isDesktop,
        updateScreenWidth,
        initializeScreenSize,
        cleanup,
    };
});
