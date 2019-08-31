export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function slice(text) {
  let m = text.match(/\[(.*?)\]\((.*?)\)/)

  if(m) {
    const i = text.indexOf(m[0])

    return [
      { text: text.slice(0, i) },
      { text: m[1], url: m[2] },
      ...slice(text.slice(m[0].length + i, text.length))
    ]
  }

  return [{ text }]
}
function markdown(body) {
  return body.split('\n').map(m => m.replace(/^ *$/,''))
}

function map(array) {
  const base = { time: 20 }
  let settings = {}
  return array.reduce((p, text) => {
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
