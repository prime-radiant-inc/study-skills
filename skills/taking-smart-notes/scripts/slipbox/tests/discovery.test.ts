import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { discoverSlipbox } from "../src/discovery";

describe("discoverSlipbox", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-test-"));
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("finds flat layout from cwd", () => {
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    const sb = discoverSlipbox(tmp);
    expect(sb.layout).toBe("flat");
    expect(sb.zettelDir).toBe(join(tmp, "notes/zettel"));
    expect(sb.sourcesDir).toBe(join(tmp, "notes/sources"));
  });

  test("finds slip-box from subdirectory (walks up)", () => {
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    mkdirSync(join(tmp, "subdir/deeper"), { recursive: true });
    const sb = discoverSlipbox(join(tmp, "subdir/deeper"));
    expect(sb.zettelDir).toBe(join(tmp, "notes/zettel"));
  });

  test("finds trade-namespaced layout (single trade)", () => {
    mkdirSync(join(tmp, "notes/trades/pm/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/trades/pm/sources"), { recursive: true });
    const sb = discoverSlipbox(tmp);
    expect(sb.layout).toBe("trade");
    expect(sb.trade).toBe("pm");
    expect(sb.zettelDir).toBe(join(tmp, "notes/trades/pm/zettel"));
  });

  test("requires --trade when multiple trades", () => {
    mkdirSync(join(tmp, "notes/trades/pm/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/trades/accounting/zettel"), { recursive: true });
    expect(() => discoverSlipbox(tmp)).toThrow(/multiple trade/i);
  });

  test("flat layout takes precedence over trades (transition mode)", () => {
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    mkdirSync(join(tmp, "notes/trades/pm/zettel"), { recursive: true });
    const sb = discoverSlipbox(tmp);
    expect(sb.layout).toBe("flat");
  });

  test("throws when no slip-box found", () => {
    expect(() => discoverSlipbox(tmp)).toThrow(/no slip-?box/i);
  });

  test("flat layout sets personalBeliefsDir = beliefsDir = notes/beliefs", () => {
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const sb = discoverSlipbox(tmp);
    expect(sb.personalBeliefsDir).toBe(join(tmp, "notes/beliefs"));
    expect(sb.beliefsDir).toBe(join(tmp, "notes/beliefs"));
  });

  test("trade layout: personalBeliefsDir at root, beliefsDir at trade", () => {
    mkdirSync(join(tmp, "notes/trades/tpm/zettel"), { recursive: true });
    const sb = discoverSlipbox(tmp);
    expect(sb.personalBeliefsDir).toBe(join(tmp, "notes/beliefs"));
    expect(sb.beliefsDir).toBe(join(tmp, "notes/trades/tpm/beliefs"));
  });
});
