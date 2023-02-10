import { CommandLine, OutputLine } from "../types/line";

export function isCommandLine(line: OutputLine): line is CommandLine {
  return (<CommandLine>line).path !== undefined;
}
