export type CommandHandler = (args: string[]) => Promise<number>;

export const COMMANDS: Record<string, CommandHandler> = {};

export function register(name: string, handler: CommandHandler): void {
  COMMANDS[name] = handler;
}
