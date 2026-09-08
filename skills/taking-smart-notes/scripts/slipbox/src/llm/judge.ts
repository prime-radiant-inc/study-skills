export function resolveJudgeCommand(): string | null {
  if (process.env.SLIPBOX_LLM_JUDGE_CMD) return process.env.SLIPBOX_LLM_JUDGE_CMD;
  try {
    const r = Bun.spawnSync(["which", "claude"]);
    if (r.exitCode === 0) return "claude -p";
  } catch {
    // claude not found
  }
  try {
    const r = Bun.spawnSync(["which", "codex"]);
    if (r.exitCode === 0) return "codex chat";
  } catch {
    // codex not found
  }
  return null;
}

export async function runJudge(prompt: string, _timeoutMs = 60000): Promise<string> {
  const cmd = resolveJudgeCommand();
  if (!cmd) {
    throw new Error(
      "no LLM judge available; set SLIPBOX_LLM_JUDGE_CMD or install claude/codex CLI",
    );
  }
  const proc = Bun.spawn(["sh", "-c", cmd], { stdin: "pipe", stdout: "pipe", stderr: "pipe" });
  proc.stdin.write(prompt);
  await proc.stdin.end();
  const out = await new Response(proc.stdout).text();
  await proc.exited;
  return out;
}
