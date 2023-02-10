import { ParsedLine } from "./parse";

export type CommandAttributes = {
  body: string
  command: string
  alias?: string[]
  help?: string
}

export type Files = Record<string, { default: CommandAttributes }>

export type HelpProperties = Required<Omit<CommandAttributes, "body">>

export type CommandsLines = Record<string, ParsedLine[]>
