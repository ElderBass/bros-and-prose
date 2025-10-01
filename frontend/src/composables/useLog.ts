import { apiRequest } from "@/services/api";
import type { Log } from "@/types";

export const useLog = () => {
    const postLog = async (log: Log) => {
        await apiRequest("POST", "/api/log", { log });
    };

    return {
        postLog,
    };
};
