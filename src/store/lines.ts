import { get, writable } from 'svelte/store'
import { sleep } from '../utils'
import { path } from './path'
import { Style } from './system'

export type LineType = {
  value: string
  style: Style
  blink?: boolean
  command?: boolean
  path?: string
}

export const lines = writable<LineType[]>([])
let lastCommand = ''

function pushLine(line: LineType): LineType {
  lines.update(_lines => [..._lines, line])
  return line
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

export async function processLine(line: LineType, animate = false): Promise<void> {
  await sleep(20)

  if (!animate) {
    pushLine({
      ...line,
      value: line.value.replace(/\[.*\]\(const:command\)/, lastCommand),
    })
    return
  }

  const commandLine = pushLine({
    value: '',
    style: line.style,
  })
  for (const l of line.value) {
    await sleep(100)
    commandLine.value += l
    updateLastLine(commandLine)
  }
}

export async function processCommandLine(
  command: string,
  animate = false,
): Promise<void> {
  lastCommand = command

  if (!animate) {
    pushLine({
      value: command,
      command: true,
      path: get(path),
      style: new Style(),
    })
    return
  }

  const commandLine = pushLine({
    value: '',
    blink: true,
    command: true,
    path: get(path),
    style: new Style(),
  })
  for (const c of command) {
    await sleep(50)
    commandLine.value += c
    updateLastLine(commandLine)
  }
  await sleep(1000)
  commandLine.blink = false
  updateLastLine(commandLine)
}
