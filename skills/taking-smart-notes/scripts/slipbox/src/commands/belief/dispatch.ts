import { register } from "../index";

const HELP = `slipbox belief — first-person epistemic state

Usage: slipbox belief <subcommand> [args]

Subcommands:
  belief new <slug> --scope=<personal|trade> --title="..." --falsifier="..." [--note="..."]
                                  create a belief skeleton
  belief list [--scope=<>] [--status=<>] [--sort=last_reviewed|created|title]
                                  list beliefs
  belief show <slug>              print belief w/ resolved links
  belief link <belief-slug> <other-slug>
                                  bidirectionally link
  belief review <slug> --note="..."
                                  bump last_reviewed; append review entry
  belief revise <slug> --note="..." [--status=<>]
                                  append revise entry; optionally change status

See skills/holding-beliefs/SKILL.md for discipline.
`;

type SubHandler = (args: string[]) => Promise<number>;
const SUB: Record<string, SubHandler> = {};

export function registerBeliefSub(name: string, handler: SubHandler): void {
  SUB[name] = handler;
}

register("belief", async (args) => {
  if (args.length === 0) {
    console.error("slipbox belief: usage: slipbox belief <subcommand> [args]");
    console.error(HELP);
    return 2;
  }
  const sub = args[0];
  if (sub === "--help" || sub === "-h") {
    console.log(HELP);
    return 0;
  }
  const handler = SUB[sub as string];
  if (!handler) {
    console.error(`slipbox belief: unknown subcommand: ${sub}`);
    console.error("run 'slipbox belief --help' for usage");
    return 2;
  }
  // Catch I/O exceptions from the belief layer (ambiguous slug across scopes,
  // scope-mismatch in saveBelief) and surface them as clean exit-2 errors
  // rather than letting Bun's unhandled-rejection stack trace leak to the user.
  try {
    return await handler(args.slice(1));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`slipbox belief ${sub}: ${msg}`);
    return 2;
  }
});
