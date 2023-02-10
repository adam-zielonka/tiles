import { makeAutoObservable } from "mobx";
import { CommandsLines, HelpProperties } from "../types/commands";
import { ParsedLine } from "../types/parse";
import { importCommands } from "../utils/commands";

export class Commands {
  private commands: CommandsLines = {};
  private help: HelpProperties[] = [];

  constructor() {
    makeAutoObservable(this);
    const { commands, help } = importCommands();
    this.commands = commands;
    this.help = help;
  }

  get helpLines(): string[] {
    return this.help.map(
      ({ command, alias, help }) => `**${[command, ...alias].join(" | ")}** - ${help}`,
    );
  }

  getLines(command: string): ParsedLine[] {
    return this.commands[this.commands[command] ? command : "notFound"];
  }

  getCompletions(command: string): string[] {
    return Object.keys(this.commands).filter(c => c.startsWith(command) && c !== command);
  }
}
