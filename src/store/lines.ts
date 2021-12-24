import { writable } from 'svelte/store'
import type { LineType } from './commands'

export const lines = writable<LineType[]>([])

export const pushLine = (line: LineType): LineType => {
  lines.update(_lines => [..._lines, line])
  window.scrollTo(0, document.body.scrollHeight)
  return line
}

export const clearLines = () => {
  lines.set([])
}

export const updateLastLine = (line: LineType) => {
  lines.update(_lines => {
    if (_lines.length) {
      _lines[_lines.length - 1] = line
    }
    return [..._lines]
  })
}
