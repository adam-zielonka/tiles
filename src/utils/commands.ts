import { CommandAttributes, CommandsLines, HelpProperties } from "../types/commands";
import { parseLines } from "./parse";

export function importCommands() {
  return installCommands(loadCommandsFiles());
}

function loadCommandsFiles(): CommandAttributes[] {
  const files = import.meta.glob<CommandAttributes>("../commands/*.md", { eager: true });
  return Object.values(files);
}

function installCommands(files: CommandAttributes[]): {
  commands: CommandsLines
  help: HelpProperties[]
} {
  const help: HelpProperties[] = [];
  const commands: CommandsLines = {};

  for (const attributes of files) {
    const lines = parseLines(attributes.body);
    commands[attributes.command] = lines;
    for (const alias of attributes.alias ?? []) {
      commands[alias] = lines;
    }
    if (attributes.help) {
      help.push({
        command: attributes.command,
        alias: attributes.alias ?? [],
        help: attributes.help,
      });
    }
  }

  return { commands, help };
}
