import { get, writable } from 'svelte/store'
import { sleep } from '../utils'
import { path } from './path'
import { Style } from './system'

type TextLineType = {
  value: string
  style: Style
}

type CommandLineType = {
  value: string
  blink: boolean
  path: string
}

export type LineType = TextLineType | CommandLineType

export function isCommandLine(line: LineType): line is CommandLineType {
  return (<CommandLineType>line).path !== undefined
}

export const lines = writable<LineType[]>([])
let lastCommand = ''

function pushLine(line: LineType): void {
  lines.update(_lines => [..._lines, line])
}

export function clearLines(): void {
  lines.set([])
}

function updateLastLine(line: LineType): void {
  lines.update(_lines => {
    if (_lines.length) {
      _lines[_lines.length - 1] = line
    }
    return [..._lines]
  })
}

export async function processLine(line: TextLineType, animate = false): Promise<void> {
  await sleep(20)

  const value = line.value.replace(/\[.*\]\(const:command\)/, lastCommand)

  const textLine: TextLineType = {
    ...line,
    value,
  }

  if (!animate) {
    pushLine(textLine)
    return
  }

  textLine.value = ''
  pushLine(textLine)
  for (const letter of value) {
    await sleep(100)
    textLine.value += letter
    updateLastLine(textLine)
  }
}

export async function processCommandLine(
  command: string,
  animate = false,
): Promise<void> {
  lastCommand = command

  const commandLine: CommandLineType = {
    value: command,
    blink: false,
    path: get(path),
  }

  if (!animate) {
    pushLine(commandLine)
    return
  }

  commandLine.value = ''
  commandLine.blink = true
  pushLine(commandLine)
  for (const letter of command) {
    await sleep(50)
    commandLine.value += letter
    updateLastLine(commandLine)
  }
  await sleep(1000)
  commandLine.blink = false
  updateLastLine(commandLine)
}
