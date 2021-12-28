import { CommandLine, parseLines } from '../utils'

export type CommandAttributes = {
  body: string
  command: string
  alias?: string[]
  help?: string
}

type Files = Record<string, { [key: string]: CommandAttributes }>
export type Commands = Record<string, CommandLine[]>
type HelpProperties = Required<Omit<CommandAttributes, 'body'>>

export function loadCommands(): CommandAttributes[] {
  const files = import.meta.globEager('../commands/*.md') as Files
  return Object.keys(files).map(file => files[file].default)
}

function installCommands(files: CommandAttributes[]): {
  commands: Commands
  help: HelpProperties[]
} {
  const help: HelpProperties[] = []
  const commands: Commands = {}

  for (const attributes of files) {
    const lines = parseLines(attributes.body)
    commands[attributes.command] = lines
    for (const alias of attributes.alias || []) {
      commands[alias] = lines
    }
    if (attributes.help) {
      help.push({
        command: attributes.command,
        alias: attributes.alias || [],
        help: attributes.help,
      })
    }
  }

  return { commands, help }
}

const { commands, help } = installCommands(loadCommands())

export function getCommandLines(command: string): CommandLine[] {
  return commands[commands[command] ? command : 'notFound']
}

export function getHelpLines(): string[] {
  return help.map(
    ({ command, alias, help }) => `**${[command, ...alias].join(' | ')}** - ${help}`,
  )
}

export function getCommandCompletions(command: string): string[] {
  return Object.keys(commands).filter(c => c.startsWith(command) && c !== command)
}
