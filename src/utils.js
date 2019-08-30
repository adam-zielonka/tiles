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
  let sleep = 20
  return array.reduce((p, c) => {
    const match = c.match(/^\[\]\((.*):(.*)\)$/)
    const result = { time: sleep, text: c }
    sleep = match && match[1] === 'sleep' ? +match[2] : 20
    if(!match) p.push(result)
    return p
  },[])
}

export const getMappedLines = body => map(markdown(body))

export function loadCommands() {
  const context = require.context('./commands', true, /\.md$/)
  const files = context.keys().map(filename => context(filename))

  return files.reduce((p,c) => {
    const { attributes, body } = c
    if(attributes.command) p[attributes.command] = getMappedLines(body)
    return p
  }, {})
}
