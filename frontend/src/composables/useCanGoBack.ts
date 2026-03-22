import { computed } from "vue";
import { useRoute } from "vue-router";

/**
 * Whether the browser history stack has a prior SPA entry Vue Router can return to.
 * Relies on `history.state.position` set by Vue Router's HTML5 history (position 0 = first entry in tab).
 */
export function useCanGoBack() {
    const route = useRoute();

    return computed(() => {
        if (typeof window === "undefined") return false;
        void route.fullPath;
        const pos = (window.history.state as { position?: number } | null)
            ?.position;
        return typeof pos === "number" && pos > 0;
    });
}
