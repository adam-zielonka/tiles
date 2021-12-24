import type { FrontMatterResult } from 'front-matter'
import { CommandProperties, loadCommands } from '../commands/loadCommands'

export type LineType = {
  text: string
  time: number
  system?: string
  blink?: boolean
  command?: boolean
}

export type Commands = Record<string, LineType[]>

function parseLines(body: string): LineType[] {
  const array = body.split('\n').map(m => m.replace(/^ *$/, ''))

  const base = { time: 20, text: '' }
  const lines: LineType[] = []
  let settings: LineType = { ...base }

  for (const text of array) {
    const [match, namespace, action] = text.match(/^\[\]\((.*):(.*)\)$/) || []
    if (match) {
      if (namespace === 'sleep') {
        settings.time = +action
      } else if (namespace === 'system') {
        settings.system = action
      }
    } else {
      lines.push({ ...settings, text })
      settings = { ...base }
    }
  }

  if (!lines.length) lines.push({ ...base, ...settings })
  if (lines[lines.length - 1].system) lines.push({ ...base })

  return lines
}

function installCommands(files: FrontMatterResult<CommandProperties>[] = []): {
  commands: Commands
  help: CommandProperties[]
} {
  const help: CommandProperties[] = []
  const commands: Commands = {}

  for (const { attributes, body } of files) {
    const lines = parseLines(body)
    if (attributes.command) commands[attributes.command] = lines
    if (attributes.alias)
      for (const alias of attributes.alias) {
        commands[alias] = lines
      }
    if (attributes.help) help.push(attributes)
  }

  return { commands, help }
}

export const { commands, help } = installCommands(loadCommands())
