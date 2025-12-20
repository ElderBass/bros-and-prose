import { DEFAULT_ALERT } from "@/constants";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Alert } from "@/types";

export const useUIStore = defineStore("ui", () => {
    const isAppLoading = ref(false);

    const alert = ref(DEFAULT_ALERT);

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

    const setIsAppLoading = (isLoading: boolean) => {
        isAppLoading.value = isLoading;
    };

    return {
        alert,
        showAlert,
        dismissAlert,
        isAppLoading,
        setIsAppLoading,
    };
});
