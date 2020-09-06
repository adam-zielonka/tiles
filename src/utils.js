export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function parseCommand(body) {
  const array = body.split('\n').map(m => m.replace(/^ *$/,''))

  const base = { time: 20 }
  const lines = []
  let settings = {}

  for (const text of array) {
    const [match, namespace, action] = text.match(/^\[\]\((.*):(.*)\)$/) || []
    if(match) {
      if(namespace === 'sleep') {
        settings.time = +action
      } else {
        settings[namespace] = action
      }
    } else {
      lines.push({ ...base, ...settings, text })
      settings = {}
    }
  }

  if(!lines.length) lines.push({ text: '', ...base, ...settings })
  if(lines[lines.length - 1].system) lines.push({ ...base, text: '' })

  return lines
}

export function requireCommands() {
  try {
    const context = require.context('./commands', true, /\.md$/)
    return context.keys().map(filename => context(filename))
  } catch (error) {
    return []
  }
}

export function installCommands(files = []) {
  const help = []
  const commands = {}

  for (const { attributes, body } of files) {
    const lines = parseCommand(body)
    if(attributes.command) commands[attributes.command] = lines
    if(attributes.alias) for(const alias of attributes.alias) {
      commands[alias] = lines
    }
    if(attributes.help) help.push(attributes)
  }

  return { commands, help }
}

export function prepareText({ text, start, end }) {
  const isSelection = start !== end
  const newEnd = end + (isSelection ? 0 : 1)

  const preparedText = [
    text.slice(0, start),
    text.slice(start, newEnd),
    text.slice(newEnd),
  ]

  if(preparedText[1] === '') preparedText[1] = '\u00a0'

  return { isSelection, preparedText }
}

export function parseText(text, result = []) {
  const [match, leftText, title, url, rightText] 
    = text.match(/^(.*)\[(.*?)\]\((.*?)\)(.*)$/) || []
  
  if(!match) return [{ text }, ...result]

  return parseText(leftText, [{ text: title, url }, { text: rightText }, ...result])
}

function fontCompare(font, baseFont) {
  const context = document.createElement('canvas').getContext('2d')
  const text = 'abcdefghijklmnopqrstuvwxyz0123456789'
  context.font = `72px ${baseFont}`
  const baselineSize = context.measureText(text).width
  context.font = `72px ${font}, ${baseFont}`
  const newSize = context.measureText(text).width
  return newSize !== baselineSize
}

export function isFontExist(font) {
  return !!(
    fontCompare(font, 'serif') 
    || fontCompare(font, 'sans-serif') 
    || fontCompare(font, 'cursive') 
    || fontCompare(font, 'monospace')
  )
}
