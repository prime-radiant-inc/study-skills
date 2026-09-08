import { describe, expect, test } from "bun:test";
import { hashBody } from "../src/embedding/staleness";

describe("hashBody", () => {
  test("ignores leading/trailing whitespace", () => {
    expect(hashBody("hello")).toBe(hashBody("\n\nhello\n\n"));
  });

  test("differs for different content", () => {
    expect(hashBody("hello")).not.toBe(hashBody("world"));
  });

  test("is deterministic", () => {
    expect(hashBody("foo")).toBe(hashBody("foo"));
  });
});
