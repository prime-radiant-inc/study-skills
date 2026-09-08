import { describe, expect, test } from "bun:test";
import { resolveJudgeCommand } from "../src/llm/judge";

describe("LLM judge", () => {
  test("uses SLIPBOX_LLM_JUDGE_CMD when set", () => {
    process.env.SLIPBOX_LLM_JUDGE_CMD = "echo {}";
    expect(resolveJudgeCommand()).toBe("echo {}");
    process.env.SLIPBOX_LLM_JUDGE_CMD = undefined;
  });
});
