import { logClient, getClientLogFromSeverity } from "./log";
import type { LogSeverity } from "./log-model";
import { describe, expect, it } from "vite-plus/test";

describe("Test suite for core/log", () => {
  describe("Unit tests for getClientLogFromSeverity", () => {
    it.concurrent.each([
      { severity: "info", expected: logClient.log },
      { severity: "warning", expected: logClient.warn },
      { severity: "error", expected: logClient.error },
    ] satisfies {
      severity: LogSeverity;
      expected: unknown;
    }[])(
      "getClientLogFromSeverity($severity) should return logClient.$severity",
      ({ severity, expected }) => {
        expect(getClientLogFromSeverity(severity)).toEqual(expected);
      },
    );
  });
});
