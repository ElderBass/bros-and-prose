import { apiRequest } from "@/services/api";
import type { Log } from "@/types";

export const useLog = () => {
    const postLog = async (log: Log) => {
        await apiRequest("POST", "/api/log", { log });
    };

    const error = async (message: string) => {
        const log = {
            message,
            level: "error",
            timestamp: new Date().toISOString(),
            isError: true,
        };
        await postLog(log);
    };

    const info = async (message: string) => {
        const log = {
            message,
            level: "info",
            timestamp: new Date().toISOString(),
            isError: false,
        };
        await postLog(log);
    };

    const warning = async (message: string) => {
        const log = {
            message,
            level: "warning",
            timestamp: new Date().toISOString(),
            isError: false,
        };
        await postLog(log);
    };

    return {
        postLog,
        error,
        info,
        warning,
    };
};
