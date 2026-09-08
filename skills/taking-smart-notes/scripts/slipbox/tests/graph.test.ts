import { describe, expect, test } from "bun:test";
import { connectedComponents, louvain } from "../src/graph";

describe("graph algorithms", () => {
  test("connectedComponents finds two components", () => {
    const adj = new Map<string, string[]>([
      ["a", ["b"]],
      ["b", ["a"]],
      ["c", ["d"]],
      ["d", ["c"]],
    ]);
    const cc = connectedComponents(adj);
    expect(cc.length).toBe(2);
    const sizes = cc.map((c) => c.length).sort();
    expect(sizes).toEqual([2, 2]);
  });

  test("louvain on a barbell graph finds two communities", () => {
    const adj = new Map<string, string[]>([
      ["a", ["b", "c"]],
      ["b", ["a", "c"]],
      ["c", ["a", "b", "d"]],
      ["d", ["c", "e", "f"]],
      ["e", ["d", "f"]],
      ["f", ["d", "e"]],
    ]);
    const partition = louvain(adj);
    expect(partition.get("a")).toBe(partition.get("b"));
    expect(partition.get("d")).toBe(partition.get("e"));
    expect(partition.get("a")).not.toBe(partition.get("d"));
  });
});
