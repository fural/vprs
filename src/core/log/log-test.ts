import { logClient, getClientLogFromSeverity } from "./log";
import type { LogSeverity } from "./log-model";
import { describe, expect, it } from "vite-plus/test";

describe("Test suite for core/log", () => {
  describe("Unit tests for getClientLogFromSeverity", () => {
    it.concurrent.each([
      { severity: "info" as LogSeverity, fnName: "log", result: logClient.log },
      { severity: "warning" as LogSeverity, fnName: "warn", result: logClient.warn },
      { severity: "error" as LogSeverity, fnName: "error", result: logClient.error },
    ])(
      "getClientLogFromSeverity($severity) should be logClient.$fnName",
      async ({ severity, result }) => {
        expect(getClientLogFromSeverity(severity)).toEqual(result);
      },
    );
  });
});
