import { makeAutoObservable } from "mobx";
import { sleep } from "../utils";
import { store } from "./store";
import { Style } from "./system";

type TextLineType = {
  value: string
  style: Style
}

type CommandLineType = {
  value: string
  blink: boolean
  path: string
}

export type LineType = TextLineType | CommandLineType

export function isCommandLine(line: LineType): line is CommandLineType {
  return (<CommandLineType>line).path !== undefined;
}

export class Output {
  lines: LineType[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  push(...line: LineType[]): number {
    const number = this.lines.push(...line);
    return number;
  }

  clear(): void {
    this.lines.splice(0, this.lines.length);
  }

  updateLast(line: LineType): void {
    if (this.lines.length) {
      this.lines[this.lines.length - 1] = line;
    }
  }

  async processLine(line: TextLineType, animate = false): Promise<void> {
    await sleep(20);

    const value = line.value.replace(/\[.*\]\(const:command\)/, store.history.lastCommand);

    const textLine: TextLineType = {
      ...line,
      value,
    };

    if (!animate) {
      this.push(textLine);
      return;
    }

    textLine.value = "";
    this.push(textLine);
    for (const letter of value) {
      await sleep(100);
      textLine.value += letter;
      this.updateLast(textLine);
    }
  }

  async processCommandLine(command: string, animate = false): Promise<void> {
    const commandLine: CommandLineType = {
      value: command,
      blink: false,
      path: store.path.value,
    };

    if (!animate) {
      this.push(commandLine);
      return;
    }

    commandLine.value = "";
    commandLine.blink = true;
    this.push(commandLine);
    for (const letter of command) {
      await sleep(50);
      commandLine.value += letter;
      this.updateLast(commandLine);
    }
    await sleep(1000);
    commandLine.blink = false;
    this.updateLast(commandLine);
  }
}
