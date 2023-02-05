export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class CommandLine {
  value = "";
  actions: {
    namespace: string
    action: string
    value: string
  }[] = [];
}

export function parseLines(body: string): CommandLine[] {
  const array = body.split("\n").map(m => m.replace(/^ *$/, ""));

  const lines: CommandLine[] = [];
  let line: CommandLine = new CommandLine();

  for (const text of array) {
    const [match, value, namespace, action] =
      text.match(/^\[(.*)\]\(([a-z-]*):([a-z0-9-]*)\)$/) || [];

    if (match) {
      line.actions.push({ namespace, action, value });
    } else {
      line.value = text;
      lines.push(line);
      line = new CommandLine();
    }
  }

  lines[lines.length - 1]?.actions.push({ namespace: "ui", action: "hide", value: "" });

  return lines;
}
