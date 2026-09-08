#!/usr/bin/env bun
import { COMMANDS } from "./commands/index";
import "./commands/register-all";

const VERSION = "0.1.0-dev";
const args = process.argv.slice(2);

const USAGE = `slipbox v${VERSION}
Usage: slipbox <subcommand> [args]

Subcommands:
  new <slug>             create a zettel skeleton
  link <a> <b>           bidirectionally link two zettels
  unlink <a> <b>         remove bidirectional link
  show <slug>            show zettel + back-references
  check [--strict]       validate slip-box symmetry and schema; --strict also
                         resolves skill ## Deeper context refs (default skills/,
                         override with SLIPBOX_SKILLS_DIRS)
  search <query>         full-text search (use --semantic for embedding search)
  rename <old> <new>     rename zettel; rewrite all references
  similar <slug>         find similar zettels by embedding cosine
  suggest-links <slug>   LLM-curated link suggestions
  stats                  slip-box statistics
  clusters               detect connected components / communities
  moc <topic>            generate Map of Content draft
  audit                  audit zettels against skill criteria
  belief <subcommand>    manage first-person beliefs (run 'slipbox belief --help')
  init                   scaffold a new slip-box
  reindex [--force]      rebuild embedding index

Options:
  --version, -v   print version
  --help, -h      this message
  --json          machine-readable output (subcommand-specific)
  --trade <name>  select trade in trade-namespaced slip-box
`;

if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
  console.log(USAGE);
  process.exit(0);
}

if (args[0] === "--version" || args[0] === "-v") {
  console.log(VERSION);
  process.exit(0);
}

const cmdName = args[0] as string;
const cmdArgs = args.slice(1);
const handler = COMMANDS[cmdName];
if (!handler) {
  console.error(`slipbox: unknown subcommand: ${cmdName}`);
  console.error("run 'slipbox --help' for usage");
  process.exit(2);
}

// --help/-h anywhere in a subcommand's args means usage, never execution —
// `init --help` once scaffolded a real slip-box. `belief` owns its own help.
if (cmdName !== "belief" && (cmdArgs.includes("--help") || cmdArgs.includes("-h"))) {
  console.log(USAGE);
  process.exit(0);
}

const exitCode = await handler(cmdArgs);
process.exit(exitCode);
