export function parseText(text) {
  let match = text.match(/\[(.*?)\]\((.*?)\)/)

  if(match) {
    const index = text.indexOf(match[0])

    return [
      { text: text.slice(0, index) },
      { text: match[1], url: match[2] },
      ...parseText(text.slice(match[0].length + index, text.length))
    ]
  }

  return [{ text }]
}
