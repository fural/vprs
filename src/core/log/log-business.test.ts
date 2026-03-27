import { joinMessages } from "./log-business";
import { describe, expect, it } from "vite-plus/test";

describe("Test suite for core/log business", () => {
  describe("Unit tests for joinMessages", () => {
    it.concurrent.each([
      { separator: undefined, args: [], expected: "" },
      { separator: undefined, args: [undefined], expected: "" },
      { separator: undefined, args: [null], expected: "" },
      { separator: undefined, args: [undefined, null], expected: "" },
      { separator: undefined, args: ["a"], expected: "a" },
      { separator: undefined, args: [1], expected: "1" },
      { separator: undefined, args: [1, "a"], expected: "1. a" },
      { separator: undefined, args: [1, null, "a"], expected: "1. a" },
      { separator: undefined, args: [1, "a", 2, "b"], expected: "1. a. 2. b" },
      { separator: "-", args: [1, "a"], expected: "1-a" },
      { separator: "-", args: [1, null, "a"], expected: "1-a" },
      { separator: "-", args: [1, "a", 2, "b"], expected: "1-a-2-b" },
    ])(
      'joinMessages($separator)($args) should equal "$expected"',
      ({ separator, args, expected }) => {
        expect(joinMessages(separator)(...args)).toEqual(expected);
      },
    );
  });
});
