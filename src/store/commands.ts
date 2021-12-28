import type { FrontMatterResult } from 'front-matter'
import { CommandProperties, loadCommands } from '../commands/loadCommands'
import { CommandLine, parseLines } from '../utils'

export type Commands = Record<string, CommandLine[]>
type HelpProperties = Required<CommandProperties>

function installCommands(files: FrontMatterResult<CommandProperties>[] = []): {
  commands: Commands
  help: HelpProperties[]
} {
  const help: HelpProperties[] = []
  const commands: Commands = {}

  for (const { attributes, body } of files) {
    const lines = parseLines(body)
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
