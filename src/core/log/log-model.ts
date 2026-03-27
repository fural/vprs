export type LogSeverity = "info" | "warning" | "error";

export interface LogClientApi extends Pick<Console, "log" | "info" | "error" | "warn" | "debug"> {
  logSeverity(severity: LogSeverity, ...args: unknown[]): void;
  logColor(color: string, ...args: unknown[]): void;
}
