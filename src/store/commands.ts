import type { FrontMatterResult } from 'front-matter'
import { CommandProperties, loadCommands } from '../commands/loadCommands'

export type CommandLine = {
  value: string
  time: number
  system?: string
  ui?: string
}

export type Commands = Record<string, CommandLine[]>

function parseLines(body: string): CommandLine[] {
  const array = body.split('\n').map(m => m.replace(/^ *$/, ''))

  const defaults: CommandLine = { time: 20, value: '' }
  const lines: CommandLine[] = []
  let settings: CommandLine = { ...defaults }

  for (const text of array) {
    const [, namespace, action] = text.match(/^\[\]\((.*):(.*)\)$/) || []

    if (namespace === 'sleep') {
      settings.time = +action
    } else if (namespace === 'system') {
      settings.system = action
    } else if (namespace === 'ui') {
      settings.ui = action
    } else {
      lines.push({ ...settings, value: text })
      settings = { ...defaults }
    }
  }

  return lines
}

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

export const getCommandLines = (command: string): CommandLine[] =>
  commands[commands[command] ? command : 'notFound']

export const getHelpLines = (): string[] =>
  help.map(
    ({ command, alias, help }) => `**${[command, ...alias].join(' | ')}** - ${help}`,
  )

export const getCommandCompletions = (command: string): string[] => {
  return Object.keys(commands).filter(c => c.startsWith(command) && c !== command)
}
