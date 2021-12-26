import { get, writable } from 'svelte/store'
import { sleep } from '../utils'
import type { LineType } from './commands'
import { path } from './path'

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

export const processLine = async (line: LineType) => {
  await sleep(line.time)
  pushLine({
    ...line,
    text: line.text.replace(/\[.*\]\(const:command\)/, lastCommand),
  })
}

export const processCommandLine = async (command: string, animate = false) => {
  lastCommand = command

  if (!animate) {
    pushLine({
      text: command,
      command: true,
      time: 0,
      path: get(path),
    })
    return
  }

  const commandLine = pushLine({
    text: '',
    blink: true,
    command: true,
    time: 20,
    path: get(path),
  })
  for (const c of command) {
    await sleep(50)
    commandLine.text += c
    updateLastLine(commandLine)
  }
  await sleep(1000)
  commandLine.blink = false
  updateLastLine(commandLine)
}
