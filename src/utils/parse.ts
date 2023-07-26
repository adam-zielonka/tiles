import { ParsedLine } from "../types/parse";
import { marked, Renderer } from "marked";

Renderer.prototype.paragraph = text => text;

export function parseLines(body: string): ParsedLine[] {
  const array = body.split("\n").map(m => m.replace(/^ *$/, ""));

  const lines: ParsedLine[] = [];
  let line: ParsedLine = { value: "", actions: [] };

  for (const text of array) {
    const [match, value, namespace, key] =
      text.match(/^\[(.*)\]\(([a-z-]*):([a-z0-9-]*)\)$/) ?? [];

    if (match) {
      line.actions.push({ namespace, key, value });
    } else {
      line.value = marked(text || "&nbsp;", { mangle: false, headerIds: false });
      lines.push(line);
      line = { value: "", actions: [] };
    }
  }

  lines[lines.length - 1]?.actions.push({ namespace: "ui", key: "hide", value: "" });

  return lines;
}
