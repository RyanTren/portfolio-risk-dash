export type AlertColor ="success" | "danger" | "warning"| "default" | "primary" | "secondary";

export interface AlertState {
    color: AlertColor;
    title: string;
}