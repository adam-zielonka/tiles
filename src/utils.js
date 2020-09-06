export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function markdown(body) {
  return body.split('\n').map(m => m.replace(/^ *$/,''))
}

function map(array) {
  const base = { time: 20 }
  let settings = {}
  const lines = array.reduce((p, text) => {
    const match = text.match(/^\[\]\((.*):(.*)\)$/)
    if(match) {
      if(match[1] === 'sleep') {
        settings.time = +match[2]
      } else {
        settings[match[1]] = match[2]
      }
    } else {
      p.push({ ...base, ...settings, text })
      settings = {}
    }
    return p
  },[])

  const lastLine = lines[lines.length - 1]
  if(lastLine.system) lines.push({ ...base, text: '' })

  return lines
}

export const getMappedLines = body => map(markdown(body))

export function requireFiles() {
  if (typeof require.context !== 'undefined') {
    const context = require.context('./commands', true, /\.md$/)
    return context.keys().map(filename => context(filename))
  }
  return []
}

export function loadCommands() {
  const files = requireFiles()
  const help = []

  const commands = files.reduce((p,c) => {
    const { attributes, body } = c
    const lines = getMappedLines(body)
    if(attributes.command) p[attributes.command] = lines
    if(attributes.alias) for(const alias of attributes.alias) {
      p[alias] = lines
    }
    if(attributes.help) help.push(attributes)
    return p
  }, {})

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
