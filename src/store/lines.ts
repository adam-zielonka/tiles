import { get, writable } from 'svelte/store'
import { sleep } from '../utils'
import { STYLE_DEFAULTS } from './constants'
import { path } from './path'
import { Style } from './system'

export type LineType = {
  value: string
  time: number
  style: Style
  blink?: boolean
  command?: boolean
  path?: string
}

export const lines = writable<LineType[]>([])
let lastCommand = ''

const pushLine = (line: LineType): LineType => {
  lines.update(_lines => [..._lines, line])
  window.scrollTo(0, document.body.scrollHeight)
  return line
}

export const clearLines = () => {
  lines.set([])
}

const updateLastLine = (line: LineType) => {
  lines.update(_lines => {
    if (_lines.length) {
      _lines[_lines.length - 1] = line
    }
    return [..._lines]
  })
}

export const processLine = async (line: LineType, animate = false) => {
  await sleep(line.time)

  if (!animate) {
    pushLine({
      ...line,
      value: line.value.replace(/\[.*\]\(const:command\)/, lastCommand),
    })
    return
  }

  const commandLine = pushLine({
    value: '',
    time: 20,
    style: line.style,
  })
  for (const l of line.value) {
    await sleep(100)
    commandLine.value += l
    updateLastLine(commandLine)
  }
}

export const processCommandLine = async (command: string, animate = false) => {
  lastCommand = command

  if (!animate) {
    pushLine({
      value: command,
      command: true,
      time: 0,
      path: get(path),
      style: STYLE_DEFAULTS,
    })
    return
  }

  const commandLine = pushLine({
    value: '',
    blink: true,
    command: true,
    time: 20,
    path: get(path),
    style: STYLE_DEFAULTS,
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
