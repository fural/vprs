/**
 * For future usage/extensibility.
 * Low level logging system/api abstraction. As of today, it is only considered
 * for dev purposes and that's why it redirects every log to the standard
 * output (console).
 * In the future, this might be used in production for error monitoring
 * or traceability so that error reports are sent to backend for debugging or
 * inspection.
 */

import type { LogClientApi, LogSeverity } from "./log-model";

// Log client to log to the server.
export const logServer: unknown = undefined;

// Log client to log to the browser console.
export const logClient: LogClientApi = Object.create(console);

export const getClientLogFromSeverity = (severity: LogSeverity) =>
  severity === "error" ? logClient.error : severity === "warning" ? logClient.warn : logClient.log;

logClient.logSeverity = (severity, ...args) => getClientLogFromSeverity(severity)(...args);

logClient.logColor = (color, ...args) => logClient.log("%c" + args?.join(" "), `color: ${color}`);
