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

export function loadCommands() {
  const context = require.context('./commands', true, /\.md$/)
  const files = context.keys().map(filename => context(filename))
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
