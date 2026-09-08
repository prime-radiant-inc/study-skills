import { describe, expect, test } from "bun:test";
import { cosine } from "../src/embedding/index_loader";

describe("cosine", () => {
  test("identical vectors → 1", () => {
    expect(cosine([1, 0, 0], [1, 0, 0])).toBeCloseTo(1, 5);
  });
  test("orthogonal → 0", () => {
    expect(cosine([1, 0, 0], [0, 1, 0])).toBeCloseTo(0, 5);
  });
  test("opposite → -1", () => {
    expect(cosine([1, 0, 0], [-1, 0, 0])).toBeCloseTo(-1, 5);
  });
});
