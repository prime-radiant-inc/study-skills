import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { discoverSlipbox } from "../src/discovery";
import { type Sidecar, loadSidecar, saveSidecar, sidecarPath } from "../src/embedding/sidecar";

describe("sidecar I/O", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-test-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    mkdirSync(join(tmp, "notes/.embeddings"), { recursive: true });
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("save and load round-trip", () => {
    const sb = discoverSlipbox(tmp);
    const sc: Sidecar = {
      slug: "x",
      embedding: [0.1, -0.2, 0.3],
      dim: 3,
      model: "test-model",
      content_sha256: "abc123",
      mtime_ns: 1000,
      indexed_at: 1000,
    };
    saveSidecar(sb, "x", sc);
    expect(existsSync(sidecarPath(sb, "x"))).toBe(true);
    const loaded = loadSidecar(sb, "x");
    expect(loaded?.slug).toBe("x");
    expect(loaded?.dim).toBe(3);
    expect(loaded?.embedding).toEqual([0.1, -0.2, 0.3]);
  });

  test("loadSidecar returns null when absent", () => {
    const sb = discoverSlipbox(tmp);
    expect(loadSidecar(sb, "missing")).toBeNull();
  });
});
