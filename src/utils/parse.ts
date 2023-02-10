export class ParsedLine {
  value = "";
  actions: {
    namespace: string
    key: string
    value: string
  }[] = [];
}

export function parseLines(body: string): ParsedLine[] {
  const array = body.split("\n").map(m => m.replace(/^ *$/, ""));

  const lines: ParsedLine[] = [];
  let line: ParsedLine = new ParsedLine();

  for (const text of array) {
    const [match, value, namespace, key] =
      text.match(/^\[(.*)\]\(([a-z-]*):([a-z0-9-]*)\)$/) || [];

    if (match) {
      line.actions.push({ namespace, key, value });
    } else {
      line.value = text;
      lines.push(line);
      line = new ParsedLine();
    }
  }

  lines[lines.length - 1]?.actions.push({ namespace: "ui", key: "hide", value: "" });

  return lines;
}
