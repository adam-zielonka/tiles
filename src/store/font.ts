import { writable } from 'svelte/store'

export const font = writable('')

function fontCompare(font: string, baseFont: string): boolean {
  const context = document.createElement('canvas').getContext('2d')
  const text = 'abcdefghijklmnopqrstuvwxyz0123456789'
  if (!context) {
    return false
  }
  context.font = `72px ${baseFont}`
  const baselineSize = context.measureText(text).width
  context.font = `72px ${font}, ${baseFont}`
  const newSize = context.measureText(text).width
  return newSize !== baselineSize
}

function isFontExist(font: string): boolean {
  return !!(
    fontCompare(font, 'serif') ||
    fontCompare(font, 'sans-serif') ||
    fontCompare(font, 'cursive') ||
    fontCompare(font, 'monospace')
  )
}

export function setFont(newFont: string): string[] {
  if (!isFontExist(newFont) && newFont) {
    return [`Font family **'${newFont}'** is not installed`]
  }

  font.set(`${newFont ? newFont + ', ' : ''}"Courier New", Courier, monospace`)
  return []
}
