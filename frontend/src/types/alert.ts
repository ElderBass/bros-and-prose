import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type AlertType = "success" | "error" | "warning" | "info";

export interface Alert {
    show: boolean;
    messages: string[];
    type: AlertType;
    duration: number;
    dismissable: boolean;
}

export type AlertColor = "blue" | "lavender" | "green" | "fuschia" | "red";
export interface AlertProperties {
    color: AlertColor;
    icon: IconDefinition;
    title: string;
}
