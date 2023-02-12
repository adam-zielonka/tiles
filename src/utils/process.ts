import { CSSProperties } from "react";
import { sleep } from "../utils/sleep";
import { store } from "../store/store";

export async function process(commandArgs: string): Promise<void> {
  const [command, ...args] = parseArgs(commandArgs);
  if (!command) {
    return;
  }

  const style: CSSProperties = {};

  main: for (const line of store.commands.getLines(command)) {
    let animate = false;

    for (const action of line.actions) {
      switch (action.namespace) {
        case "sleep":
          await sleep(+action.key);
          continue;
        case "system":
          for (const systemLine of await system(action.key, args)) {
            await store.output.processLine({ value: systemLine, style });
          }
          continue;
        case "ui":
          if (action.key === "hide") continue main;
          if (action.key === "animate") animate = true;
          continue;
        case "css": {
          Object.assign(style, css(action.key, action.value));
          continue;
        }
      }
    }

    await store.output.processLine({ value: line.value, style }, animate);
  }
}

function css(key: string, value: string): CSSProperties {
  const newKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
  return { [newKey]: value };
}

async function system(sysCommand: string, args: string[]): Promise<string[]> {
  switch (sysCommand) {
    case "clear":
      store.output.clear();
      return [];
    case "shutdown":
      store.system.setShutdown();
      return [];
    case "freeze":
      store.system.setFreeze();
      return [];
    case "echo":
      return [args.join(" ")];
    case "font":
      return store.style.set(args.join(" "));
    case "cd":
      await store.path.cd(args.join(" "));
      return [];
    case "pwd":
      return [store.path.pwd];
    case "help":
      return store.commands.helpLines;
    default:
      return [];
  }
}

function parseArgs(commandArgs: string): string[] {
  return [...commandArgs.matchAll(/["']([^"']*)["']| ?([^"' ]+) ?/g)]
    .map(m => m[1] || m[2])
    .filter(c => !!c);
}
