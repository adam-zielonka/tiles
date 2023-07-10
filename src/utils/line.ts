import { CommandLine, OutputLine } from "../types/line";

export function isCommandLine(line: OutputLine): line is CommandLine {
  return (line as CommandLine).path !== undefined;
}
