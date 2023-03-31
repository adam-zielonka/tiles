import { ParsedLine } from "./parse";

export type CommandAttributes = {
  body: string
  command: string
  alias?: string[]
  help?: string
}

export type FrontMatter = Omit<CommandAttributes, "body">

export type HelpProperties = Required<FrontMatter>

export type CommandsLines = Record<string, ParsedLine[]>
