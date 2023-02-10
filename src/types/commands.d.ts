import { ParsedLine } from "../utils/parse";

type CommandAttributes = {
  body: string
  command: string
  alias?: string[]
  help?: string
}
type Files = Record<string, { default: CommandAttributes }>
type HelpProperties = Required<Omit<CommandAttributes, "body">>
type CommandsLines = Record<string, ParsedLine[]>
